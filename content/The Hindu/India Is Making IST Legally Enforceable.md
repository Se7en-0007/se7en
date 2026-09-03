## India Already Has Indian Standard Time

- **Indian Standard Time (IST)** has been in place for decades.
- The **Legal Metrology (Indian Standard Time) Rules, 2026** make IST the **legally enforceable reference** for **official and commercial use**.
- Systems across sectors will be required to synchronise with time **traceable to IST**.
- The objective of **“One Nation, One Time”** is to establish **one common national time reference**, allowing events and measurements to be properly compared.

## National Metrology Institute

- Under an **Act of Parliament**, **CSIR-National Physical Laboratory (CSIR-NPL)** is India’s **National Metrology Institute**, mandated to maintain the country’s scientific standards.
- Maintaining and disseminating IST is part of CSIR-NPL’s mandate.
- **IST® (Indian Standard Time)** is a **registered trademark** of CSIR-NPL.
- Until now, **time did not have legal status** in the country, so there was no enforceable requirement for a person or organisation’s time to be **traceable to IST**.
- **NPL** is the standards body, while enforcement comes under the **Department of Legal Metrology**.
- Legal Metrology inspectors already check measurements such as **mass** and **volume**, including petrol-pump measurements and establishment weights, but did not have an equivalent capability for time.

## Regional Reference Standards Laboratories

- **Five Regional Reference Standards Laboratories (RRSLs)** maintain **secondary time scales** traceable to IST through **CSIR-NPL**.
- **ISRO** also maintains IST traceability links from NPL.
- This enables IST to be disseminated and realised at multiple locations while retaining traceability to the national reference maintained by CSIR-NPL.
- IST is intended to become the common legal time reference for **commercial and other purposes**, including the **display of time**.
- A common reference can improve **cybersecurity**, reduce **crime**, and make **critical infrastructure** more resilient.

## What Does It Mean For Time To Be “Traceable” To IST?

- A computer’s time must come from a source. In date-and-time settings, users can choose an **NTP (Network Time Protocol) server**.
- The default server may be abroad and may therefore not directly provide IST.
- At present, people obtain time from multiple sources, often indirectly through **GPS**.
- A telecom provider may provide time maintained in its data centre, but there can be a lag of **seconds or even minutes**.
- For example, one FM station may announce **seven** according to its studio clock while another announces **7.01**, because they are referring to different sources.
- Synchronising a computer with NPL’s NTP service makes the computer **traceable to Indian Standard Time**.

## NTP, PTP And Other Methods

- **NTP** is the most common and accessible method and works over the **internet**.
- Other methods include **PTP (Precision Time Protocol)**, **satellite links**, **optical links**, and **NavIC**.
- The method used depends on the required level of accuracy.
- **ISRO** needs traceability to IST within **nanoseconds**.
- India’s time is maintained within **a few nanoseconds** of the international reference, **UTC**.
- For many ordinary applications, **NTP** can provide **millisecond-level accuracy**.
- **PTP** can provide **microsecond-level accuracy** and works particularly well within a **local area network**.
- Every clock or oscillator begins to drift after synchronisation. NTP checks the reference at adjustable **polling intervals**, depending on how closely a system must remain aligned with IST.
- Highly precise time transfer can use satellite links. NPL provides ISRO time through satellite links using techniques such as **Common-View GNSS** and **two-way satellite time and frequency transfer**.
- Optical links over dedicated **dark fibre** can attain **picosecond-level accuracy**, though they are not universally available.
- **Defence** and other critical applications may need very high accuracy, while **banking and finance** may find millisecond-level NTP services sufficient.

## What Will Businesses Have To Do To Comply?

- At the minimum, an organisation must be able to show that its systems are synchronised with IST.
- Computer settings can show the selected **time server** or **domain name**.
- **NPL**, **NIC**, and the **RRSLs** provide their own services.
- A direct **PTP** or **satellite connection** can also demonstrate that an organisation receives time from an approved source.
- There is **no exemption at this moment**.
- Organisations such as **hotels** or **ISRO launch centres** may display other time zones, provided they also display **IST** and use it as the reference.
- The requirement is not merely about time display. It requires synchronisation so that **“the seconds start at the same time across applications and sectors”.**
- Enforcement will be handled by the **Legal Metrology Department**.
- NPL will advise the Department because it helped establish the regional time scales and dissemination technologies.
- A compliance-checking mechanism will be created, with further procedures introduced over time.

## What Does This Mean For An Ordinary User?

- Unless a person runs a business, they are unlikely to face an immediate requirement.
- Accurate time can matter when investigators or courts need to reconstruct events, such as during a **fraud investigation**.
- For ordinary users, compliance will largely occur through service providers.
- If service providers comply, the time supplied automatically to devices will be traceable to IST.
- Computers already allow users to select a time server, and NPL provides instructions for doing so on its website.

## Why Does India Want To Reduce Reliance On Foreign Satellite-Based Timing Sources?

- Most people presently obtain time through **GPS**, which is owned by the **United States**.
- The United States can degrade or deny access to its services.
- During the **Kargil War**, India was denied access to the GPS information it had sought. This led India to ask its space agency to develop a similar navigation system.
- ISRO developed the **Indian Regional Navigation Satellite System (IRNSS)**, now called **NavIC**.
- NavIC provides regional satellite-navigation coverage over **India and the surrounding region**.
- NavIC was designed to ensure an independent navigation capability if access to GPS were denied.
- Time is critical to navigation. **NavIC satellites carry atomic clocks**, while ISRO ground stations are traceable to IST through satellite links.
- NPL provides the time reference for NavIC. Therefore, obtaining time through NavIC is another way to receive time traceable to IST.
- NPL has developed **indigenous primary frequency standards**, is developing **advanced atomic clocks**, and is upgrading its timing infrastructure.
- These capabilities are intended to provide India an **independent and resilient source of highly accurate time**, ensuring continuity of the national time scale and critical time-dependent services even during failures or disruptions of international traceability links.