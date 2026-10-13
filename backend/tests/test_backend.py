import os
import sys
import pytest

sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))))

from backend.app import create_app
from backend.app.config import TestConfig
from backend.app.models import db, User, Member, Transaction, ClaimToken, Loan
from backend.app.services.financial_service import FinancialService, naira_to_kobo
from backend.app.services.auth_service import AuthService
from backend.app.services.jwt_auth import generate_token

@pytest.fixture
def app():
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def seeded_users(app):
    with app.app_context():
        admin = User(
            email='admin@mosunmolacoop.ng',
            full_name='Master Administrator',
            role='master_admin',
            is_active=True
        )
        admin.set_password('AdminPass123')
        db.session.add(admin)

        treasurer = User(
            email='treasurer@mosunmolacoop.ng',
            full_name='Chief Treasurer',
            role='treasurer',
            is_active=True
        )
        treasurer.set_password('TreasurerPass123')
        db.session.add(treasurer)

        secretary = User(
            email='secretary@mosunmolacoop.ng',
            full_name='Secretariat Officer',
            role='secretary',
            is_active=True
        )
        secretary.set_password('SecretaryPass123')
        db.session.add(secretary)

        member_rec = Member(
            member_id='MCS-2026-9001',
            full_name='Alhaji Sikiru Adeleke',
            email='sikiru@adeleke.ng',
            phone='+234 802 111 2233',
            status='active'
        )
        db.session.add(member_rec)
        db.session.flush()

        member_user = User(
            email='sikiru@adeleke.ng',
            full_name='Alhaji Sikiru Adeleke',
            role='member',
            is_active=True,
            member_id=member_rec.id
        )
        member_user.set_password('MemberPass123')
        db.session.add(member_user)

        db.session.commit()

        return {
            'admin_id': admin.id,
            'treasurer_id': treasurer.id,
            'secretary_id': secretary.id,
            'member_id': member_user.id,
            'member_rec_id': member_rec.id,
            'admin_token': generate_token(admin),
            'treasurer_token': generate_token(treasurer),
            'secretary_token': generate_token(secretary),
            'member_token': generate_token(member_user),
        }

# 1. AUTHENTICATION & BOOTSTRAP TESTS
def test_bootstrap_master_admin_allowlist(client, app):
    res = client.post('/api/auth/bootstrap', json={
        'email': 'admin@mosunmolacoop.ng',
        'password': 'NewPassword123',
        'fullName': 'Super Admin',
        'bootstrapSecret': 'WRONG_SECRET'
    })
    assert res.status_code == 403

    res = client.post('/api/auth/bootstrap', json={
        'email': 'hacker@random.com',
        'password': 'NewPassword123',
        'fullName': 'Super Admin',
        'bootstrapSecret': 'MOSUNMOLA_INIT_BOOTSTRAP_2026'
    })
    assert res.status_code == 400

    res = client.post('/api/auth/bootstrap', json={
        'email': 'admin@mosunmolacoop.ng',
        'password': 'SecurePassword123',
        'fullName': 'Honourable President',
        'bootstrapSecret': 'MOSUNMOLA_INIT_BOOTSTRAP_2026'
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data['success'] is True
    assert data['data']['role'] == 'master_admin'

    res2 = client.post('/api/auth/bootstrap', json={
        'email': 'admin@mosunmolacoop.ng',
        'password': 'AnotherPassword123',
        'fullName': 'Honourable President',
        'bootstrapSecret': 'MOSUNMOLA_INIT_BOOTSTRAP_2026'
    })
    assert res2.status_code == 403

def test_login_and_token_generation(client, seeded_users):
    res = client.post('/api/auth/login', json={
        'email': 'admin@mosunmolacoop.ng',
        'password': 'AdminPass123'
    })
    assert res.status_code == 200
    data = res.get_json()
    assert 'token' in data['data']
    assert data['data']['user']['role'] == 'master_admin'

    res_bad = client.post('/api/auth/login', json={
        'email': 'admin@mosunmolacoop.ng',
        'password': 'WrongPassword'
    })
    assert res_bad.status_code == 401

# 2. ROLE AUTHORIZATION MATRIX TESTS
def test_rbac_restrictions(client, seeded_users):
    mem_token = seeded_users['member_token']
    sec_token = seeded_users['secretary_token']
    tre_token = seeded_users['treasurer_token']
    member_rec_id = seeded_users['member_rec_id']

    # Member cannot access admin members API
    res = client.get('/api/admin/members', headers={'Authorization': f'Bearer {mem_token}'})
    assert res.status_code == 403

    # Secretary cannot record financial transactions (Treasurer/Master Admin only)
    res = client.post('/api/admin/transactions', headers={'Authorization': f'Bearer {sec_token}'}, json={
        'memberId': member_rec_id,
        'amount': 50000,
        'category': 'savings',
        'description': 'Attempted payment by secretary'
    })
    assert res.status_code == 403

    # Treasurer CAN record financial transactions
    res_tre = client.post('/api/admin/transactions', headers={'Authorization': f'Bearer {tre_token}'}, json={
        'memberId': member_rec_id,
        'amount': 50000,
        'category': 'savings',
        'description': 'October thrift payment',
        'paymentMethod': 'cash'
    })
    assert res_tre.status_code == 201

# 3. MEMBER ACCOUNT CLAIMING FLOW
def test_member_account_claiming(client, seeded_users, app):
    with app.app_context():
        sec = User.query.get(seeded_users['secretary_id'])
        unclaimed = Member(
            member_id='MCS-2026-7788',
            full_name='Mrs. Kemi Olatunji',
            phone='+234 803 999 8877'
        )
        db.session.add(unclaimed)
        db.session.flush()

        claim_code = AuthService.generate_member_claim_code(sec, unclaimed.member_id)

    claim_res = client.post('/api/auth/member/claim', json={
        'memberId': 'MCS-2026-7788',
        'registeredName': 'Mrs. Kemi Olatunji',
        'claimCode': claim_code,
        'password': 'NewClaimedPassword@2026'
    })
    assert claim_res.status_code == 200
    assert claim_res.get_json()['success'] is True

    dup_res = client.post('/api/auth/member/claim', json={
        'memberId': 'MCS-2026-7788',
        'registeredName': 'Mrs. Kemi Olatunji',
        'claimCode': claim_code,
        'password': 'AnotherPassword'
    })
    assert dup_res.status_code == 400

# 4. INTEGER KOBO ARITHMETIC & ₦50 AJO DEDUCTION
def test_ajo_statutory_deduction_ledger(client, seeded_users):
    tre_token = seeded_users['treasurer_token']
    member_rec_id = seeded_users['member_rec_id']

    res = client.post('/api/admin/transactions', headers={'Authorization': f'Bearer {tre_token}'}, json={
        'memberId': member_rec_id,
        'amount': 5000,
        'category': 'ajo',
        'txnType': 'deposit',
        'paymentMethod': 'cash',
        'description': 'Ajo contribution for 12 October cycle'
    })
    assert res.status_code == 201
    txn = res.get_json()['data']

    assert txn['grossAmountNaira'] == 5000.0
    assert txn['deductionAmountNaira'] == 50.0
    assert txn['netAmountNaira'] == 4950.0
    assert txn['grossAmountKobo'] == 500000
    assert txn['deductionAmountKobo'] == 5000
    assert txn['netAmountKobo'] == 495000
    assert '₦50 statutory cooperative administrative deduction' in txn['deductionReason']

# 5. READ-ONLY MEMBER PORTAL
def test_member_portal_read_only_enforcement(client, seeded_users):
    mem_token = seeded_users['member_token']

    res_summary = client.get('/api/member/financial-summary', headers={'Authorization': f'Bearer {mem_token}'})
    assert res_summary.status_code == 200
    data = res_summary.get_json()['data']
    assert 'savingsBalanceNaira' in data
    assert 'ajoNetCreditedNaira' in data

    res_pay = client.post('/api/member/deposit', headers={'Authorization': f'Bearer {mem_token}'}, json={
        'amount': 25000
    })
    assert res_pay.status_code == 403
    assert 'not permitted from the member portal' in res_pay.get_json()['message']

# 6. TRANSACTION REVERSAL & AUDIT INTEGRITY
def test_transaction_reversal_audit(client, seeded_users):
    tre_token = seeded_users['treasurer_token']
    member_rec_id = seeded_users['member_rec_id']

    res_pay = client.post('/api/admin/transactions', headers={'Authorization': f'Bearer {tre_token}'}, json={
        'memberId': member_rec_id,
        'amount': 15000,
        'category': 'savings',
        'txnType': 'deposit',
        'paymentMethod': 'cash',
        'description': 'Erroneous duplicate entry'
    })
    txn_id = res_pay.get_json()['data']['id']

    res_rev = client.post(f'/api/admin/transactions/{txn_id}/reverse', headers={'Authorization': f'Bearer {tre_token}'}, json={
        'reason': 'Entered in error by cashier'
    })
    assert res_rev.status_code == 200
    rev_data = res_rev.get_json()['data']
    assert rev_data['txnType'] == 'reversal'
    assert rev_data['netAmountNaira'] == -15000.0
    assert rev_data['parentTransactionId'] == txn_id

# 7. SYSTEM METRICS ENDPOINT
def test_system_metrics(client, seeded_users):
    admin_token = seeded_users['admin_token']
    mem_token = seeded_users['member_token']

    # Members should NOT access metrics
    res = client.get('/api/admin/metrics', headers={'Authorization': f'Bearer {mem_token}'})
    assert res.status_code == 403

    # Admin CAN access metrics
    res = client.get('/api/admin/metrics', headers={'Authorization': f'Bearer {admin_token}'})
    assert res.status_code == 200
    data = res.get_json()['data']
    assert 'totalMembers' in data
    assert 'dailyIntakeNaira' in data
    assert 'pendingDepositsCount' in data

# 8. BULK MEMBER IMPORT
def test_bulk_member_import(client, seeded_users):
    admin_token = seeded_users['admin_token']
    mem_token = seeded_users['member_token']

    # Members cannot bulk import
    res = client.post('/api/admin/members/bulk-import', headers={'Authorization': f'Bearer {mem_token}'}, json={
        'rows': [{'fullName': 'Test Person', 'phone': '08012345678'}]
    })
    assert res.status_code == 403

    # Admin CAN bulk import
    rows = [
        {'memberId': 'MCS-2026-BULK-001', 'fullName': 'Chief Adebayo Olumide', 'phone': '+234 801 222 3333', 'totalSavings': 150000},
        {'memberId': 'MCS-2026-BULK-002', 'fullName': 'Mrs. Nkechi Okonkwo', 'phone': '+234 802 333 4444', 'occupation': 'Textile Trader'},
        {'memberId': 'MCS-2026-BULK-001', 'fullName': 'Chief Adebayo Olumide', 'phone': '+234 801 222 3333'},  # Duplicate memberId
    ]
    res = client.post('/api/admin/members/bulk-import', headers={'Authorization': f'Bearer {admin_token}'}, json={
        'rows': rows
    })
    assert res.status_code == 201
    data = res.get_json()['data']
    assert data['totalImported'] == 2
    assert data['duplicateCount'] == 1  # One duplicate by memberId
    assert data['totalSavingsBroughtForward'] == 150000

# 9. WALK-IN REGISTRATION
def test_walk_in_registration(client, seeded_users):
    admin_token = seeded_users['admin_token']
    sec_token = seeded_users['secretary_token']

    # Secretary CAN register walk-in members
    res = client.post('/api/admin/members/walk-in', headers={'Authorization': f'Bearer {sec_token}'}, json={
        'fullName': 'Alhaji Mustapha Ibrahim',
        'phone': '+234 803 555 6666',
        'occupation': 'Agricultural Supplier',
        'branch': 'Kano Branch Office'
    })
    assert res.status_code == 201
    data = res.get_json()['data']
    assert data['fullName'] == 'Alhaji Mustapha Ibrahim'
    assert 'MCS-2026-' in data['memberId']

    # Validation: missing fullName
    res = client.post('/api/admin/members/walk-in', headers={'Authorization': f'Bearer {admin_token}'}, json={
        'phone': '+234 803 555 6666'
    })
    assert res.status_code == 400

# 10. CLAIM CODE GENERATION VIA ADMIN BULK ROUTE
def test_generate_claim_code_for_member(client, seeded_users):
    admin_token = seeded_users['admin_token']
    member_rec_id = seeded_users['member_rec_id']

    res = client.post(f'/api/admin/members/{member_rec_id}/generate-claim-code', headers={'Authorization': f'Bearer {admin_token}'})
    assert res.status_code == 200
    data = res.get_json()['data']
    assert 'claimCode' in data
    assert data['expiresInHours'] == 72

# 11. FINANCIAL REPORTS SUMMARY
def test_financial_reports_summary(client, seeded_users):
    tre_token = seeded_users['treasurer_token']
    member_rec_id = seeded_users['member_rec_id']

    # Record a transaction first
    client.post('/api/admin/transactions', headers={'Authorization': f'Bearer {tre_token}'}, json={
        'memberId': member_rec_id,
        'amount': 100000,
        'category': 'savings',
        'description': 'Test savings for report',
        'paymentMethod': 'cash'
    })

    res = client.get('/api/admin/reports/summary', headers={'Authorization': f'Bearer {tre_token}'})
    assert res.status_code == 200
    data = res.get_json()['data']
    assert 'totalSavingsNaira' in data
    assert 'todayTotalCollectionNaira' in data
    assert data['totalMembers'] >= 1

# 12. MEMBER LOGIN VIA REGISTERED PHONE NUMBER AS PASSWORD
def test_member_login_via_phone_password(client, seeded_users, app):
    # Alhaji Sikiru Adeleke has member_id='MCS-2026-9001' and phone='+234 802 111 2233'
    # Test logging in using normalized 08021112233 as password:
    res = client.post('/api/auth/login', json={
        'memberId': 'MCS-2026-9001',
        'password': '08021112233'
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    assert 'token' in data['data']
    assert data['data']['user']['memberId'] == 'MCS-2026-9001'
    assert data['data']['member']['phone'] == '+234 802 111 2233'

    # Test fresh member without existing User record
    with app.app_context():
        fresh_member = Member(
            member_id='MCS-2026-9999',
            full_name='Hon. Tunde Bakare',
            phone='08055554433',
            email='tunde.bakare@mosunmolacoop.ng',
            status='active'
        )
        db.session.add(fresh_member)
        db.session.commit()

    # Log in using phone as password - should auto-provision User and return token
    fresh_login_res = client.post('/api/auth/login', json={
        'memberId': 'MCS-2026-9999',
        'password': '08055554433'
    })
    assert fresh_login_res.status_code == 200
    fresh_data = fresh_login_res.get_json()
    assert fresh_data['success'] is True
    assert 'token' in fresh_data['data']
    assert fresh_data['data']['user']['role'] == 'member'
    assert fresh_data['data']['member']['fullName'] == 'Hon. Tunde Bakare'


