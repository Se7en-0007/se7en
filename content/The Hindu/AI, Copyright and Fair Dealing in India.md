## <mark style="background: #CACFD9A6;">Background</mark>

- Case: ANI (Asian News International) vs OpenAI - a copyright infringement suit alleging OpenAI trained ChatGPT on ANI's copyrighted news content.
    
- Ruling date: July 24 (interim order), Delhi High Court.
    
- Global backdrop: In the preceding year, US district courts (in cases involving Anthropic and Meta) had held that training LLMs on copyrighted books constitutes "fair use" under US law.
    
- Expert consulted: Arul George Scaria, law professor at National Law School of India University (NLSIU), Bengaluru, who served as amicus curiae (court-appointed expert) in the case.
    
- Significance: This is being reported as a landmark interim ruling shaping how Indian copyright law treats AI/LLM training - important given India lacks a specific AI law and relies on adapting existing copyright statute.
    

## <mark style="background: #CACFD9A6;">The Core Ruling</mark>

- The Delhi HC held that training an LLM (machine learning) on copyrighted works can fall within India's "fair dealing" exception under copyright law.
    
- The judgment is interim/subject to appeal - not a final, binding precedent yet.
    
- It gives AI developers (OpenAI, and Indian players like Sarvam) a measure of legal cover to train models on available content without licensing agreements.
    
- The Court explicitly avoided ruling that this creates a "blanket" immunity - infringement liability can still arise on the output side, depending on specific facts.
    
- Overall framed as a "balanced and forward-looking" judgment, balancing rights-holders' interests against user/innovation interests, and considering that a contrary ruling could have shut down indigenous generative AI development in India.
    

## <mark style="background: #CACFD9A6;">Fair Dealing (India) vs Fair Use (US): Key Differences</mark>

|Aspect|US "Fair Use"|India "Fair Dealing"|
|---|---|---|
|Nature of exception|Broad, open-ended|Narrower, purpose-specific|
|Test structure|Single four-factor balancing test|Two-stage test|
|Four US factors|Purpose/character of use; nature of work; amount/substantiality used; market effect|Not directly imported by Delhi HC|
|Stage 1 (India only)|N/A|Must show use falls under specific listed purposes (e.g., private use, research)|
|Stage 2 (India only)|N/A|"Fairness analysis" using a unique three-factor test|
|Court's approach|Case-by-case, holistic|Court explicitly rejected blind import of US four-factor test|

Key points:

- The Delhi HC rejected directly importing the US four-factor test, since India's fair dealing exception is narrower and structured differently.
    
- Stage 1: Court took a liberal, dynamic interpretation of "private use" and "research" to find that LLM training qualifies for these categories under fair dealing.
    
- Stage 2 (Fairness test - three factors used by Delhi HC):
    
    1. Market harm to the rights-holder - Court asked whether ANI's customers would substitute paid services with LLM-generated responses; concluded no substitution effect existed here.
        
    2. Balance between rights-holders' and users' interests.
        
    3. Public interest dimension of LLMs (societal benefit of AI development).
        

## <mark style="background: #CACFD9A6;">Output-Side Liability: When Can AI Responses Infringe?</mark>

- Training itself may be protected, but generated outputs (responses) can still constitute infringement if certain conditions are met.
    
- Key findings in this case:
    
    - ANI argued ChatGPT could reproduce its content verbatim in outputs.
        
    - Court found that the examples of alleged infringement were articles published after the model's training cut-off dates (GPT-4: April 2022 cutoff; GPT-4o: April 2024 cutoff) - so those specific articles could not have been used in training.
        
    - Court also assessed "substantial similarity" between outputs and the copyrighted originals - most outputs were not substantially similar because the model generated varied responses to prompts, so this failed to meet the infringement threshold in this instance.
        
- Important nuance: News/factual content receives comparatively thinner copyright protection because facts themselves cannot be owned, and there are limited ways to express a fact - reducing the pool of copyrightable material in news reporting versus creative works like novels or music.
    
- Caveat: This non-infringement finding is fact-specific, not a blanket rule. Future cases with verbatim reproduction (e.g., via Retrieval Augmented Generation/RAG techniques in specialised domains) could result in a finding of infringement. This is why AI companies are increasingly signing licensing deals with publishers as a precautionary/business strategy.
    

## <mark style="background: #CACFD9A6;">The "Lawful Access" Question</mark>

- Central legal question: Does an AI company need "lawful access" (i.e., legitimately/legally obtained source material) to invoke the fair dealing defense?
    
- Delhi HC's answer: No - "lawful access" is not a general requirement under the fair dealing provision or most other exceptions to copyright infringement in Indian law.
    
- Rule of interpretation: Wherever the Indian Copyright Act intends to require "lawful access," it says so explicitly; where it's silent, the requirement doesn't apply.
    
- Practical implication: If a use otherwise qualifies under fair dealing (or another applicable exception not requiring lawful access), the source/manner of obtaining the content is largely irrelevant to the fair dealing defense.
    
- Caveat on circumvention: If an LLM developer bypasses technological protection measures (e.g., paywalls, anti-scraping tools) to access content, that circumvention itself can create separate liability - this is distinct from the "lawful access" question and was affirmed as a likely infringement.
    

## <mark style="background: #CACFD9A6;">Shadow Libraries and Pending Grey Areas</mark>

- Related pending matter: Elsevier vs Alexandra Elbakyan (concerning shadow libraries like Sci-Hub) is still before the Delhi HC.
    
- A preliminary observation in that case suggested such libraries do infringe copyright.
    
- Since LLMs are sometimes trained using content sourced from shadow libraries, this creates an unresolved legal grey area in India.
    
- Critique noted: The academic/research community's perspective was reportedly not fully heard in the Elsevier case, unlike the more balanced consultative approach in ANI vs OpenAI.
    
- The ANI vs OpenAI ruling's clarification (that lawful access isn't generally required for fair dealing) may help address this grey area, since it de-emphasizes the "how content was sourced" question in favor of "how content was used."
    

## <mark style="background: #CACFD9A6;">International Precedents Cited</mark>

- Google LLC vs Oracle America, Inc. (US Supreme Court, 2021): Oracle alleged Google copied Java API code to build Android; the US Supreme Court ruled 6–2 that Google's use was fair use - even though Google copied the code without permission.
    
- Google Books case: Google scanned copyrighted books without permission to provide search "snippets" to users; treated as a landmark fair use precedent internationally.
    
- Broader point: Most jurisdictions worldwide do not universally require "lawful access" as a precondition for fair use/fair dealing defenses, since doing so would defeat the exception's underlying purpose.