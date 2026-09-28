> [!quote] **Notes by** ~ [SE7EN](https://t.me/Se7en_0007)
## Types of Repo Transactions

### Core Conceptual Distinction
* **Repo Rate** = Annualized interest rate at which commercial banks borrow short-term liquidity from RBI.
* **Repo** = The underlying loan transaction executed between RBI and commercial banks using Government Securities (G-Secs) as collateral.

### Classification of Repo Transactions

| Parameter | Variable Rate Repo (VRR) | Fixed Rate Repo |
| :--- | :--- | :--- |
| **Duration** | Short-Term (< 1 Year): **1, 7, 14, 28, and 56 Days** (56 days is highest standard tenor) | Medium-Term: **1 Year to 3 Years** |
| **Interest Rate** | Decided dynamically through **competitive auction** | Fixed at **prevailing Repo Rate** |
| **Discretion** | Available strictly at **RBI's discretion** (RBI notifies amount & tenor) | Introduced at **RBI's discretion** during pandemic |
| **Status** | **Active & Primary Tool** currently used by RBI | **Discontinued** (used exclusively during COVID-19 slowdown) |

### VRR Auction Mechanics & Anti-Cartel Constraint
* **Auction Workflow**: RBI announces total loan allocation amount + tenor → Invites competitive interest bids from banks.
* **Anti-Cartel Bid Constraint**: Bid rate **CANNOT be less than or equal to Repo Rate** (Must be strictly **> Repo Rate**).
  * *Rationale*: Prevents banks from forming a cartel to bid 0% or low interest rates, protecting RBI from artificial interest loss.
* **Allocation Rule**: Repo liquidity allocated to **highest bidding bank(s)** (e.g. Bank bidding 6.25% gets priority over 6.00% or 5.75%).

### Fixed Rate Repo (COVID-19 Case Study)
* **Context**: Economic slowdown during COVID-19 required expansionary monetary policy (increasing money supply).
* **Problem with VRR during Slowdown**: Auction bidding under VRR would push borrowing costs above Repo Rate, deterring risk-averse banks from borrowing.
* **Solution**: RBI introduced **Long-Term Fixed Rate Repos (1–3 years)** at exact prevailing Repo Rate to encourage bank borrowing. Now fully discontinued.

---

## Marginal Standing Facility (MSF)

### Operational Framework
* **Definition** = Emergency liquidity window through which scheduled commercial banks borrow overnight (**1 Day**) funds from RBI.
* **Trigger Condition** = Used when a bank **has exhausted all excess G-Secs** above SLR and faces an urgent overnight cash shortfall.
* **Collateral Rule** = Banks are permitted to pledge G-Secs that are **part of their mandatory SLR quota** (unlike Repo, which strictly mandates excess SLR G-Secs).

### Key Parameters & Penal Mechanics
* **Duration** = Strictly **1 Day (Overnight)**.
* **Interest Rate** = Always **25 Basis Points (0.25%) ABOVE Repo Rate** (e.g. Repo = 5.50% → MSF = 5.75%).
  * *Basis Point Definition*: **1 Basis Point (bps) = 0.01%** | **25 bps = 0.25%** | **100 bps = 1.00%**.
  * *Rationale for 25 bps Premium*: Pledging SLR G-Secs causes a 1-day technical deficit in mandatory SLR maintenance, triggering a statutory penalty rate.
* **Borrowing Limits**:
  * **Minimum Borrowing** = **₹1 Crore**.
  * **Maximum Borrowing Ceiling** = **2% of Bank's NDTL** for that day.

### Repo vs. Marginal Standing Facility (MSF)

| Feature | Repo (Variable Rate Repo) | Marginal Standing Facility (MSF) |
| :--- | :--- | :--- |
| **Primary Objective** | Inject short-term liquidity | Inject emergency overnight liquidity |
| **Duration** | **1, 7, 14, 28, 56 Days** | Strictly **1 Day (Overnight)** |
| **G-Sec Collateral Type** | Must be **in excess of SLR** | Uses G-Secs that are **part of SLR** |
| **Interest Rate** | Auctioned (> Repo Rate) | Fixed at **Repo Rate + 25 bps (+0.25%)** |
| **Borrowing Limit** | Min ₹1 Cr; Max limited only by excess G-Secs | Min ₹1 Cr; Max strictly capped at **2% of NDTL** |

---

## Reverse Repo Mechanism

### Definition & Two-Leg Workflow
* **Definition** = Mechanism through which RBI accepts deposits from commercial banks and pays interest at the **Reverse Repo Rate**.
* **Two-Leg Transaction Cycle**:
  * **Leg 1 (Immediate)**: Bank deposits surplus cash with RBI → RBI transfers G-Secs to bank as temporary collateral.
  * **Leg 2 (Reversal)**: RBI repurchases G-Secs from bank → RBI returns cash deposit + interest (**Reverse Repo Rate**).

### Immediate Impact Rule
* **Core Rule for Liquidity Assessment**: Always evaluate monetary impact **immediately after the FIRST LEG** of any transaction.
* **First Leg Impact**: Bank transfers cash to RBI → Immediate liquidity with banks **decreases** → **Sucks out excess money supply**.

### Variable Rate Reverse Repo (VRRR)
* **Mechanics**: RBI notifies deposit amount & tenor (1, 7, 14, 28 days) → Invites interest bids from banks.
* **Auction Cap**: Banks **cannot bid interest above Repo Rate**; RBI accepts deposits at rates **below Repo Rate**.

---

## Standing Deposit Facility (SDF)

### Legal Origin & Structural Innovation
* **Launch Year** = **2022** (via statutory amendment to **RBI Act, 1934**).
* **Recommending Body** = **Urjit Patel Committee** (same committee that recommended setting up the MPC).
* **Core Innovation** = Enables RBI to absorb excess liquidity from commercial banks **WITHOUT providing Government Securities (G-Secs) as collateral**.

### Core Features & Eligible Entities
* **Duration** = Strictly **Overnight (1 Day)**.
* **Discretion** = Available at the **discretion of commercial banks** (banks can park un-utilized surplus funds with RBI at will).
* **Eligible Entities** = All Scheduled Commercial Banks, **including Regional Rural Banks (RRBs)** (*Key Prelims 2024 statement*).

### Reverse Repo vs. Standing Deposit Facility (SDF)

| Parameter | Reverse Repo | Standing Deposit Facility (SDF) |
| :--- | :--- | :--- |
| **Primary Objective** | Sucks out excess liquidity | Sucks out excess liquidity |
| **G-Sec Collateral** | **Required** (RBI provides G-Secs to bank) | **NO Collateral Required** (Uncollateralized deposit) |
| **Duration** | Variable (1 to 28 days) / Fixed | Strictly **Overnight (1 Day)** |
| **Discretion** | Discretion of **RBI** | Discretion of **Commercial Banks** |
| **Eligible Entities** | Scheduled Commercial Banks | Scheduled Commercial Banks + **RRBs** |
| **Corridor Role** | Historical floor tool | **Current Floor Tool** of LAF Corridor (since 2022) |

---

## Monetary Policy Corridor & Liquidity Adjustment Facility (LAF)

### Corridor Architecture & Standing Facilities
* **Liquidity Adjustment Facility (LAF)** = Framework comprising Repo, MSF, and SDF used by RBI to manage daily liquidity.
* **Symmetric 50 bps Width Architecture**:
  * **Ceiling (Top Rate)** = **MSF Rate** = **Repo Rate + 25 bps (+0.25%)**.
  * **Center (Benchmark Rate)** = **Repo Rate** (set by Monetary Policy Committee - MPC).
  * **Floor (Bottom Rate)** = **SDF Rate** = **Repo Rate - 25 bps (-0.25%)**.
  * **Total Corridor Width** = **50 Basis Points (0.50%)** {Gap between MSF and SDF}.

![[Pasted image 20260928182623.png|600]]

### Automatic Transmission Mechanism
* **Single Change Principle**: MPC explicitly votes and changes **ONLY the Repo Rate**.
* **Automatic Adjustment**: MSF and SDF rates **automatically shift** up or down to preserve the 25 bps offset and 50 bps corridor width without requiring separate votes.
  * *Example*: If MPC cuts Repo from **5.50% → 5.00%**, automatically **MSF → 5.25%** and **SDF → 4.75%**.
* **Historical Evolution**: In **2022**, SDF replaced Fixed Rate Reverse Repo (frozen at 3.35%) as the official corridor floor.
* **RRB Inclusion (2022)**: **Regional Rural Banks (RRBs)** were granted full access to the LAF window (Repo, MSF, and SDF).

### Standing Liquidity Facility (SLF)
* **Target Beneficiaries** = **Standalone Primary Dealers (SPDs)** (non-bank PDs like ICICI Securities, Kotak Securities).
* **Function** = Dedicated liquidity injection window for SPDs to borrow funds against G-Secs (analogous to Repo for banks).

---

## Bank Rate & Penalty Framework

### Evolution of Bank Rate
* **Pre-2000 Role** = Primary interest rate used by RBI to extend direct long-term loans to commercial banks.
* **Present Status** = Discontinued as a direct lending tool; re-purposed strictly as a **Penal Rate** (penalty rate of interest).

### Statutory Penalty Formula
* **Default Penalty** = Charged on banks failing to maintain statutory **CRR** or **SLR** requirements.
* **Formula** = **Bank Rate + 3%** (for initial default day).

### UPSC Prelims Interpretation Rule
* **Standard Rule for UPSC Exam Statements**: Interpret "Bank Rate" as **equivalent to Repo Rate / Policy Rate** (indicating tight vs. expansionary monetary stance) **UNLESS** the question explicitly mentions penalty rates for CRR/SLR defaults.
* **Statutory Parity**: **Bank Rate = MSF Rate** = **Repo Rate + 25 bps**.

---

## Open Market Operations (OMO) & Sterilization

### Definition & Mechanics
* **Definition** = **Outright purchase or sale** of Government Securities in the open market by RBI.
* **Single-Leg Transaction**: Unlike Repo/Reverse Repo, OMO involves **NO repurchase agreement** (permanent transfer of ownership).

### Operational Objectives

![[Money Supply.png|800]]

* **Sterilization Operations** = OMO sales executed specifically to absorb excess domestic liquidity resulting from heavy foreign capital inflows (forex intervention).

---

## Exchange Rate Management & Currency Dynamics

### Exchange Rate Mechanics: Depreciation vs. Appreciation
* **Baseline Example**: Exchange rate shifts from **$1 = ₹30** to **$1 = ₹60**.
  * **Rupee Depreciation**: Paying more Rupees (₹60 vs ₹30) to buy same $1 → Value of Rupee HAS DECREASED relative to Dollar.
  * **Dollar Appreciation**: Dollar value HAS INCREASED relative to Rupee.
* **Reverse Example**: Exchange rate shifts from **$1 = ₹30** to **$1 = ₹15**.
  * **Rupee Appreciation**: Paying fewer Rupees (₹15 vs ₹30) to buy same $1 → Value of Rupee HAS INCREASED.

### Commodity Analogy (Apple Model)
* Replace **Dollar** with **Apple**:
  * 1 Apple = ₹30 → 1 Apple = ₹60 → Apple price rose due to **Shortage of Apples** → Purchasing power of Rupee fell.
  * Shortage of Dollars (Demand > Supply) → Dollar price rises → **Rupee Depreciates**.

### Causal Drivers of Rupee Depreciation

![[Dollar Shortage.png|900]]

### Stakeholder Impact: Exporters vs. Importers

| Stakeholder | Impact of Rupee Depreciation ($1 = ₹30 → ₹60) | Winner / Loser Status |
| :--- | :--- | :--- |
| **Indian Exporters** | Earn **₹60 instead of ₹30** for every $1 of goods exported abroad | **WINNER** (Revenue in Rupees increases) |
| **Indian Importers** | Must pay **₹60 instead of ₹30** to purchase $1 worth of imported goods/raw materials | **LOSER** (Import costs double) |
| **Domestic Consumers** | Higher import costs for crude oil → Higher petrol/diesel freight → **Imported Inflation** | **LOSER** (Cost of living / food thali price rises) |

### Imported Inflation Causal Chain (The Thali Example)
Putin starts Russia-Ukraine War → Global Crude Oil Shortage → Crude Oil Price ($) Rises + Rupee Depreciates → India's Crude Oil Import Bill (₹) Doubles → Domestic Petrol & Diesel Prices Increase → Freight & Truck Transportation Costs Rise → Vegetable Transport Costs Rise → Restaurant Meal / Thali Price Increases.

### RBI Forex Intervention: Market Appreciation vs. RBI Revaluation

![[Pasted image 20260928182842.png|900]]

* **Appreciation** = Increase in Rupee value driven purely by **market forces of demand and supply**.
* **Revaluation** = Increase in Rupee value driven directly by **RBI intervention** (selling Forex reserves).

#Indian-Economy  #Class-Notes 