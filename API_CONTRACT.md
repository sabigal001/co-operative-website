# Mosunmola Cooperative Multipurpose Society
## Master REST API Specification & Frontend Integration Contract
**Version:** 1.0.0-PROD  
**Author:** Mosunmola Technical Architecture Team  
**Base URL:** `https://api.mosunmolacoop.ng/api/v1`  
**Authentication Scheme:** Bearer JWT (`Authorization: Bearer <token>`)

---

## 1. Authentication & Physical Card Verification Endpoints

### 1.1 Physical Card Verification Lookup
* **Endpoint:** `POST /auth/verify-card`
* **Description:** Validates physical Member ID card number against cooperative physical inventory before member onboarding.
* **Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "cardId": "MCS-2026-1033"
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Physical card verified! Details pre-filled from cooperative branch allocation.",
  "data": {
    "valid": true,
    "cardId": "MCS-2026-1033",
    "status": "unassigned",
    "prefill": {
      "fullName": "Hajiya Fatima Garba",
      "branch": "Victoria Island Regional Office",
      "phone": "+234 802 334 1122",
      "email": "fatima.garba@gmail.com"
    }
  }
}
```

**Error Response (`404 Not Found` / `400 Bad Request`):**
```json
{
  "success": false,
  "message": "Invalid Physical Member ID Card number. Card not found in register.",
  "data": {
    "valid": false,
    "cardId": "MCS-2026-0000",
    "status": "unassigned",
    "reason": "Card ID not found in physical inventory."
  }
}
```

---

### 1.2 Member Registration & Card Linking
* **Endpoint:** `POST /auth/register`
* **Description:** Creates the member's login credentials, attaches facial photo and next-of-kin, and triggers an OTP.
* **Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "cardId": "MCS-2026-1033",
  "fullName": "Hajiya Fatima Garba",
  "email": "fatima.garba@gmail.com",
  "phone": "+234 802 334 1122",
  "password": "SecurePassword@2026",
  "avatarUrl": "https://storage.mosunmolacoop.ng/avatars/fatima_garba.jpg",
  "nin": "39201948291",
  "address": "24 Saka Tinubu, Victoria Island, Lagos",
  "occupation": "Commodity Trading Specialist",
  "nextOfKin": {
    "name": "Ibrahim Garba",
    "relationship": "Brother",
    "phone": "+234 806 123 4567",
    "address": "Same as member"
  }
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Account created. A 6-digit verification code has been dispatched to phone & email.",
  "data": {
    "memberId": "MCS-2026-1033",
    "otpSentTo": "+234 802 334 1122",
    "expiresInSeconds": 600
  }
}
```

---

### 1.3 OTP Verification & Activation
* **Endpoint:** `POST /auth/verify-otp`
* **Description:** Verifies 6-digit code and activates digital membership pass.

**Request Body:**
```json
{
  "cardId": "MCS-2026-1033",
  "code": "894201"
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "OTP verified successfully. Digital card activated.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "member": {
      "id": "MEM-1033",
      "memberId": "MCS-2026-1033",
      "fullName": "Hajiya Fatima Garba",
      "status": "active",
      "kycVerified": true,
      "qrToken": "MOSUNMOLA-QR-MCS-2026-1033-VERIFIED-1772630"
    }
  }
}
```

---

### 1.4 Member Logout Session Revocation
* **Endpoint:** `POST /auth/logout`
* **Description:** Invalidates active session tokens, revokes client bearer authorization, and clears secure persistence storage.
* **Headers:** 
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "You have been securely signed out of your Mosunmola member session.",
  "data": {
    "loggedOut": true
  }
}
```

---

## 2. Member Portal Endpoints

### 2.1 Get Member Profile & Digital Card
* **Endpoint:** `GET /members/:memberId`
* **Headers:** `Authorization: Bearer <token>`

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "MEM-8942",
    "memberId": "MCS-2026-8942",
    "fullName": "Chief Adeleke Balogun",
    "email": "adeleke.balogun@mosunmolacoop.ng",
    "phone": "+234 803 456 7890",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    "joinDate": "2023-04-12",
    "status": "active",
    "kycVerified": true,
    "qrToken": "MOSUNMOLA-QR-MCS-2026-8942-VERIFIED-AUTH-TOKEN-90812",
    "bankDetails": {
      "bankName": "Access Bank PLC",
      "accountNumber": "0129482710",
      "accountName": "ADELEKE BABATUNDE BALOGUN"
    },
    "nextOfKin": {
      "name": "Mrs. Olufunke Balogun",
      "relationship": "Spouse",
      "phone": "+234 802 889 0011",
      "address": "Plot 14, Admiralty Way, Lekki Phase 1, Lagos"
    }
  }
}
```

---

### 2.2 Member Savings Account & Target Thrift Plans
* **Endpoint:** `GET /savings/:memberId`
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "totalBalance": 4200000,
    "voluntarySavings": 2750000,
    "targetSavings": 1450000,
    "dividendsEarned": 385400,
    "annualReturnRate": 18.5,
    "targetPlans": [
      {
        "id": "TGT-001",
        "title": "Lekki Phase 2 Land Deposit Co-Ownership",
        "targetAmount": 2500000,
        "currentAmount": 1850000,
        "monthlyContribution": 150000,
        "startDate": "2025-08-01",
        "endDate": "2026-12-31",
        "category": "estate",
        "autoDebit": true,
        "color": "#00C853"
      }
    ]
  }
}
```

---

### 2.3 Submit Bank Deposit Proof (Enters Treasurer Queue)
* **Endpoint:** `POST /savings/deposits`
* **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`

**Request Body:**
```json
{
  "memberId": "MCS-2026-8942",
  "amount": 250000,
  "depositType": "voluntary_savings",
  "targetPlanId": null,
  "bankReference": "ACC-NIP-89420918",
  "paymentProofUrl": "https://storage.mosunmolacoop.ng/proofs/rec_8942.pdf"
}
```

**Success Response (`202 Accepted`):**
```json
{
  "success": true,
  "message": "Deposit proof received. Treasurer will verify and credit your wallet.",
  "data": {
    "id": "DEP-2026-033",
    "reference": "DEP-TRF-8942-033",
    "status": "pending",
    "submissionDate": "2026-02-28 14:30:00"
  }
}
```

---

### 2.4 Apply for Member Loan
* **Endpoint:** `POST /loans/apply`
* **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`

**Request Body:**
```json
{
  "memberId": "MCS-2026-8942",
  "amount": 1500000,
  "purpose": "Agro-processing machinery expansion & logistics",
  "durationMonths": 6,
  "guarantors": [
    {
      "memberId": "MCS-2026-9921",
      "name": "Dr. Babatunde Alabi",
      "phone": "+234 809 112 3344",
      "relationship": "Cooperative Senior Colleague"
    },
    {
      "memberId": "MCS-2026-1033",
      "name": "Hajiya Fatima Garba",
      "phone": "+234 802 334 1122",
      "relationship": "Associate"
    }
  ]
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Loan application registered and submitted to Secretariat PA for vetting.",
  "data": {
    "id": "LN-2026-082",
    "amount": 1500000,
    "interestRate": 5.0,
    "totalRepayment": 1575000,
    "monthlyRepayment": 262500,
    "status": "pending_vetting"
  }
}
```

---

### 2.5 Get Official Transaction Receipt Data
* **Endpoint:** `GET /transactions/:transactionId/receipt`
* **Headers:** `Authorization: Bearer <token>`

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "TXN-90182",
    "reference": "REF-MOS-2026-02-90182",
    "memberId": "MCS-2026-8942",
    "memberName": "Chief Adeleke Balogun",
    "type": "deposit",
    "amount": 250000,
    "date": "2026-02-28 14:32:10",
    "status": "successful",
    "description": "Monthly Voluntary Thrift Savings Contribution",
    "paymentMethod": "Direct Bank Transfer (Access Bank)",
    "balanceAfter": 4200000,
    "societyRegistration": "LSCS/2018/8941",
    "digitalSeal": "SHA256-SEAL-90182-MOSUNMOLA-LSCS"
  }
}
```

---

## 3. Role-Based Admin Portal Endpoints

### 3.1 Master Admin Endpoints (`role: master_admin`)

#### Get Global Cooperative Metrics
* **Endpoint:** `GET /admin/metrics`
* **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "totalLiquidity": 485200000,
    "totalSavingsPool": 342800000,
    "totalOutstandingLoans": 142400000,
    "totalDisbursedLoans": 890000000,
    "totalDividendsPaid": 65400000,
    "activeMemberCount": 14852,
    "cardsInCirculation": 12480,
    "availableCardStock": 2520
  }
}
```

#### Import Physical Member ID Card Batch (CSV Upload Simulation)
* **Endpoint:** `POST /admin/cards/batch-import`
* **Request Body:**
```json
{
  "batchNumber": "BATCH-2026-Q3-LAGOS",
  "prefix": "MCS-2026",
  "count": 50,
  "branch": "Ikeja Central Secretariat"
}
```
* **Response (`201 Created`):**
```json
{
  "success": true,
  "message": "50 physical member ID cards generated and registered into active stock.",
  "data": {
    "batchNumber": "BATCH-2026-Q3-LAGOS",
    "totalCards": 50,
    "range": "MCS-2026-1008 to MCS-2026-1057"
  }
}
```

#### Update Admin Staff Role (RBAC)
* **Endpoint:** `PATCH /admin/staff/:staffId/role`
* **Request Body:**
```json
{
  "role": "treasurer" // 'master_admin' | 'treasurer' | 'pa_officer'
}
```
* **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Role updated successfully."
}
```

#### Trigger Annual Dividend Pool Allocation
* **Endpoint:** `POST /admin/dividends/trigger`
* **Request Body:**
```json
{
  "poolAmount": 45000000,
  "percentageYield": 18.5
}
```

---

### 3.2 Treasurer Admin Endpoints (`role: treasurer`)

#### Fetch Pending Member Deposits
* **Endpoint:** `GET /treasury/deposits/pending`
* **Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "DEP-2026-031",
      "reference": "DEP-TRF-9921-FEB",
      "memberId": "MCS-2026-9921",
      "memberName": "Dr. Babatunde Alabi",
      "amount": 350000,
      "bankReference": "GTB-NIP-992104829",
      "paymentProofUrl": "https://storage.mosunmolacoop.ng/proofs/alabi_gtb.pdf",
      "status": "pending"
    }
  ]
}
```

#### Approve Member Deposit
* **Endpoint:** `POST /treasury/deposits/:depositId/approve`
* **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Deposit approved and member wallet credited.",
  "data": {
    "depositId": "DEP-2026-031",
    "status": "approved",
    "creditedAmount": 350000,
    "reviewedBy": "Deaconess Maryam Awolowo (Treasurer)"
  }
}
```

#### Fetch Loans Vetted and Awaiting Disbursement
* **Endpoint:** `GET /treasury/loans/disbursement-queue`
* **Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "LN-2026-094",
      "memberId": "MCS-2026-9921",
      "memberName": "Dr. Babatunde Alabi",
      "amount": 2000000,
      "status": "vetted_pending_treasurer",
      "vettingNotes": "KYC verified, 2 confirmed guarantors with savings exceeding loan coverage."
    }
  ]
}
```

#### Disburse Vetted Loan
* **Endpoint:** `POST /treasury/loans/:loanId/disburse`
* **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Loan funds disbursed via cooperative treasury NIP transfer.",
  "data": {
    "loanId": "LN-2026-094",
    "status": "approved_disbursed",
    "disbursedAmount": 2000000,
    "disbursedDate": "2026-02-28"
  }
}
```

---

### 3.3 PA / Secretariat Admin Officer Endpoints (`role: pa_officer`)

#### Fetch Pending KYC Documents
* **Endpoint:** `GET /secretariat/kyc/pending`
* **Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "memberId": "MCS-2026-1033",
      "fullName": "Hajiya Fatima Garba",
      "idType": "NIN",
      "idNumber": "39201948291",
      "status": "pending"
    }
  ]
}
```

#### Approve or Reject Member KYC
* **Endpoint:** `POST /secretariat/kyc/:memberId/decision`
* **Request Body:**
```json
{
  "decision": "verified", // 'verified' | 'rejected'
  "officerNotes": "NIN verified with NIMC database."
}
```

#### Fetch Loans Awaiting First-Stage Secretariat Vetting
* **Endpoint:** `GET /secretariat/loans/vetting-queue`
* **Response (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "LN-2026-102",
      "memberId": "MCS-2026-5571",
      "memberName": "Engr. Emeka Okafor",
      "amount": 850000,
      "status": "pending_vetting",
      "guarantors": [
        { "memberId": "MCS-2026-8942", "name": "Chief Adeleke Balogun", "status": "accepted" }
      ]
    }
  ]
}
```

#### Vet and Forward Loan to Treasurer
* **Endpoint:** `POST /secretariat/loans/:loanId/vet`
* **Request Body:**
```json
{
  "decision": "forward_to_treasurer", // 'forward_to_treasurer' | 'rejected'
  "vettingNotes": "Guarantor savings status verified. Recommended for release."
}
```
* **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Loan application vetted and forwarded to Treasurer for disbursement.",
  "data": {
    "loanId": "LN-2026-102",
    "status": "vetted_pending_treasurer"
  }
}
```

#### Issue Physical Member Card Pickup Slip
* **Endpoint:** `POST /secretariat/cards/:cardId/pickup-slip`
* **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Pickup slip generated.",
  "data": {
    "cardId": "MCS-2026-1033",
    "slipCode": "SLIP-908129-LAG",
    "pickupBranch": "Victoria Island Regional Office"
  }
}
```

---

## 4. Prospective Membership Application & Super Admin Review Endpoints

### 4.1 Submit Prospective Membership Application (Public Landing Page)
* **Endpoint:** `POST /membership/apply`
* **Description:** Public submission by prospective members applying to join Mosunmola Cooperative Multipurpose Society. Submits directly into the Super Admin and Board vetting queue.
* **Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "fullName": "Babatunde Alabi",
  "email": "b.alabi@enterprise.ng",
  "phone": "+234 803 445 9901",
  "gender": "male",
  "dateOfBirth": "1988-06-14",
  "occupation": "Senior Software Architect",
  "monthlyIncome": 1200000,
  "monthlyThriftTarget": 150000,
  "homeAddress": "12 Admiralty Way, Lekki Phase 1, Lagos",
  "state": "Lagos",
  "lga": "Eti-Osa",
  "idType": "NIN",
  "idNumber": "78291048291",
  "nextOfKinName": "Funke Alabi",
  "nextOfKinPhone": "+234 802 119 4433",
  "nextOfKinRelationship": "Spouse",
  "referralSource": "Online Landing Page"
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Your membership application has been submitted to the Board & Super Admin! Reference: APP-2026-9281",
  "data": {
    "id": "APP-2026-9281",
    "fullName": "Babatunde Alabi",
    "email": "b.alabi@enterprise.ng",
    "phone": "+234 803 445 9901",
    "monthlyThriftTarget": 150000,
    "status": "pending_approval",
    "submittedAt": "2026-10-04 10:45:00"
  }
}
```

---

### 4.2 Super Admin: Fetch Prospective Applications Queue
* **Endpoint:** `GET /admin/membership-applications`
* **Description:** Retrieves all prospective membership applications, filterable by status (`pending_approval`, `approved`, `rejected`).
* **Headers:** `Authorization: Bearer <super_admin_token>`

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Membership applications retrieved.",
  "data": [
    {
      "id": "APP-2026-9281",
      "fullName": "Babatunde Alabi",
      "email": "b.alabi@enterprise.ng",
      "phone": "+234 803 445 9901",
      "gender": "male",
      "dateOfBirth": "1988-06-14",
      "occupation": "Senior Software Architect",
      "monthlyIncome": 1200000,
      "monthlyThriftTarget": 150000,
      "homeAddress": "12 Admiralty Way, Lekki Phase 1, Lagos",
      "state": "Lagos",
      "lga": "Eti-Osa",
      "idType": "NIN",
      "idNumber": "78291048291",
      "nextOfKinName": "Funke Alabi",
      "nextOfKinPhone": "+234 802 119 4433",
      "nextOfKinRelationship": "Spouse",
      "referralSource": "Online Landing Page",
      "status": "pending_approval",
      "submittedAt": "2026-10-04 10:45:00"
    }
  ]
}
```

---

### 4.3 Super Admin: Approve Application & Allocate Physical Card
* **Endpoint:** `POST /admin/membership-applications/:id/approve`
* **Description:** Approves a prospective applicant and allocates an official physical member RFID card ID (`MCS-2026-XXXX`). Makes the card ready for the applicant to self-activate on `members.mosunmolacoop.com`.
* **Headers:** 
  * `Authorization: Bearer <super_admin_token>`
  * `Content-Type: application/json`

**Request Body:**
```json
{
  "assignedCardId": "MCS-2026-7842",
  "issuingBranch": "Victoria Island Regional Office"
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Application APP-2026-9281 approved and allocated to Physical Card MCS-2026-7842. Notification dispatched to applicant.",
  "data": {
    "id": "APP-2026-9281",
    "fullName": "Babatunde Alabi",
    "status": "approved",
    "assignedCardId": "MCS-2026-7842",
    "reviewedBy": "Dr. Olayinka Adeleke (Super Admin)",
    "reviewedAt": "2026-10-04 11:00:00"
  }
}
```

---

### 4.4 Super Admin: Reject Application
* **Endpoint:** `POST /admin/membership-applications/:id/reject`
* **Description:** Rejects an application with statutory audit reasoning.
* **Headers:** 
  * `Authorization: Bearer <super_admin_token>`
  * `Content-Type: application/json`

**Request Body:**
```json
{
  "rejectionReason": "Unable to verify state residence or employment within statutory cooperative boundaries."
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Application APP-2026-9281 has been rejected.",
  "data": {
    "id": "APP-2026-9281",
    "status": "rejected",
    "rejectionReason": "Unable to verify state residence or employment within statutory cooperative boundaries.",
    "reviewedBy": "Dr. Olayinka Adeleke (Super Admin)",
    "reviewedAt": "2026-10-04 11:02:00"
  }
}
```

---

## 5. Multi-Subdomain Service Architecture

| Subdomain | Target Audience | Primary Functionality | Installable (PWA) |
| :--- | :--- | :--- | :--- |
| `mosunmolacoop.ng` | Prospective Members & Public | Institutional profile, 5% loan solutions, savings calculator, Board credibility, **Online Membership Application Modal** | No (Standard Web) |
| `members.mosunmolacoop.ng` | Enrolled Cooperative Members | Physical card self-activation, 3D flippable digital pass with QR, Savings goals, 5% low-interest loans, Asset portfolio, Transaction receipts | **Yes (PWA)** |
| `admin.mosunmolacoop.ng` | Executive Board & Staff (RBAC) | **Super Admin:** Prospective applications vetting & card issuance, RFID batch importer, Role permissions; **Treasurer:** Liquidity vaults & disbursements; **PA:** Secretariat KYC & verification | No (Restricted Console) |

---

## 6. Error Format & HTTP Status Codes
All responses conform strictly to:
```json
{
  "success": false,
  "message": "Human-readable explanation of error.",
  "error": "STANDARDIZED_ERROR_CODE",
  "data": null
}
```
* `200 OK`: Successful retrieval or synchronous update
* `201 Created`: Entity created (Member registered, Card batch imported, Application submitted)
* `202 Accepted`: Asynchronous submission pending approval (Deposit proof uploaded)
* `400 Bad Request`: Validation failure (Missing parameters, bad formatting)
* `401 Unauthorized`: Missing or invalid Bearer token
* `403 Forbidden`: Role does not have permission (e.g. PA attempting to disburse loan)
* `404 Not Found`: Member ID, Card ID, Application ID, or Loan ID not found
* `500 Internal Server Error`: Server failure
