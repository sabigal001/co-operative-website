import os
import sys

sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))

from backend.app import create_app
from backend.app.models import db, User, Member, Transaction, Loan, Investment, ClaimToken
from backend.app.services.financial_service import FinancialService, naira_to_kobo

def seed_database():
    app = create_app()
    with app.app_context():
        print("Creating all database tables...")
        db.create_all()

        # 1. Check if Master Admin exists
        master_email = app.config.get('MASTER_ADMIN_EMAIL', 'bhassannosimot@gmail.com')
        treasurer_email = app.config.get('TREASURER_EMAIL', 'treasurer@mosunmolacoop.ng')
        secretary_email = app.config.get('SECRETARY_EMAIL', 'secretary@mosunmolacoop.ng')

        master_user = User.query.filter_by(role='master_admin').first()
        if not master_user:
            print(f"Creating initial Master Admin ({master_email})...")
            master_user = User(
                email=master_email,
                full_name="Alhaja Mosunmola Oladipo",
                role="master_admin",
                is_active=True
            )
            master_user.set_password("Admin@Mosunmola2026")
            db.session.add(master_user)
            db.session.commit()

        # 2. Treasurer
        treasurer_user = User.query.filter_by(role='treasurer').first()
        if not treasurer_user:
            print(f"Creating initial Treasurer ({treasurer_email})...")
            treasurer_user = User(
                email=treasurer_email,
                full_name="Mr. Babatunde Alabi",
                role="treasurer",
                is_active=True
            )
            treasurer_user.set_password("Treasurer@Mosunmola2026")
            db.session.add(treasurer_user)
            db.session.commit()

        # 3. Secretary
        secretary_user = User.query.filter_by(role='secretary').first()
        if not secretary_user:
            print(f"Creating initial Secretary ({secretary_email})...")
            secretary_user = User(
                email=secretary_email,
                full_name="Mrs. Folashade Adebayo",
                role="secretary",
                is_active=True
            )
            secretary_user.set_password("Secretary@Mosunmola2026")
            db.session.add(secretary_user)
            db.session.commit()

        # 4. Seed Members
        member1 = Member.query.filter_by(member_id='MCS-2026-8942').first()
        if not member1:
            print("Seeding Member 1 (Chief Adeleke Balogun)...")
            member1 = Member(
                member_id='MCS-2026-8942',
                full_name='Chief Adeleke Balogun',
                email='adeleke.balogun@mosunmolacoop.ng',
                phone='+234 803 456 7890',
                branch='Victoria Island Regional Office',
                status='active',
                nin='28491048291',
                address='Plot 14, Admiralty Way, Lekki Phase 1, Lagos',
                occupation='Civil Engineer & Property Developer',
                bank_name='Access Bank PLC',
                account_number='0129482710',
                account_name='ADELEKE BABATUNDE BALOGUN',
                kyc_verified=True
            )
            member1.next_of_kin = {
                'name': 'Mrs. Olufunke Balogun',
                'relationship': 'Spouse',
                'phone': '+234 802 889 0011',
                'address': 'Plot 14, Admiralty Way, Lekki Phase 1, Lagos'
            }
            db.session.add(member1)
            db.session.commit()

            # Create member user account for Chief Adeleke
            user_member1 = User(
                email='adeleke.balogun@mosunmolacoop.ng',
                full_name='Chief Adeleke Balogun',
                role='member',
                is_active=True,
                member_id=member1.id
            )
            user_member1.set_password("Member@2026")
            db.session.add(user_member1)
            db.session.commit()

            # Record sample transactions with integer kobo & ₦50 Ajo deduction
            # Regular Savings: ₦250,000
            FinancialService.record_payment(
                member_id=member1.id,
                category='savings',
                txn_type='deposit',
                gross_amount_kobo=naira_to_kobo(250000),
                payment_method='bank_transfer',
                description='October monthly thrift savings contribution',
                recorded_by_user_id=treasurer_user.id,
                bank_reference='TRF-NIP-8942-01',
                is_verified=True
            )

            # Share Capital: ₦500,000
            FinancialService.record_payment(
                member_id=member1.id,
                category='shares',
                txn_type='share_purchase',
                gross_amount_kobo=naira_to_kobo(500000),
                payment_method='bank_transfer',
                description='Purchase of 5,000 cooperative ordinary shares at ₦100/share',
                recorded_by_user_id=treasurer_user.id,
                bank_reference='TRF-NIP-8942-02',
                is_verified=True
            )

            # Ajo Deposit: Gross ₦5,000, Deduction ₦50, Net credited ₦4,950
            FinancialService.record_payment(
                member_id=member1.id,
                category='ajo',
                txn_type='deposit',
                gross_amount_kobo=naira_to_kobo(5000),
                payment_method='cash',
                description='Ajo daily contribution for October cycle',
                recorded_by_user_id=treasurer_user.id,
                is_verified=True
            )

            # Active Loan: ₦1,000,000
            loan1 = Loan(
                loan_reference='LN-2026-8942-01',
                member_id=member1.id,
                principal_kobo=naira_to_kobo(1000000),
                outstanding_kobo=naira_to_kobo(650000),
                interest_rate_pct=5.0,
                duration_months=6,
                monthly_repayment_kobo=naira_to_kobo(175000),
                purpose='Commercial Agricultural Supply Expansion',
                status='active'
            )
            db.session.add(loan1)
            db.session.commit()

        # 5. Member 2 (Unclaimed account with claim code for verification test)
        member2 = Member.query.filter_by(member_id='MCS-2026-1033').first()
        if not member2:
            print("Seeding Member 2 (Hajiya Fatima Garba - Unclaimed for claim flow test)...")
            member2 = Member(
                member_id='MCS-2026-1033',
                full_name='Hajiya Fatima Garba',
                email='fatima.garba@gmail.com',
                phone='+234 802 334 1122',
                branch='Victoria Island Regional Office',
                status='active',
                nin='39201948291',
                address='24 Saka Tinubu, Victoria Island, Lagos',
                occupation='Commodity Trading Specialist',
                kyc_verified=True
            )
            db.session.add(member2)
            db.session.commit()

            # Generate claim token
            token = ClaimToken(
                member_id=member2.id,
                token_code='CLAIM-FATIMA2026',
                expires_at=ClaimToken.generate(member2.id).expires_at,
                is_used=False,
                created_by_user_id=secretary_user.id
            )
            db.session.add(token)
            db.session.commit()
            print(f"Member 2 created. Test claim code: CLAIM-FATIMA2026")

        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()
