/**
 * AI Service for Creative Ideation
 * 
 * Connected to Live Google Gemini API (gemini-3.5-flash-lite)
 * with an Intelligent Dynamic Agency Fallback Engine if the API is offline.
 */

export const generateCreativeBrief = async ({ prompt, client, platform = 'Instagram' }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      console.log(`[AI Service] Calling Google Gemini API for prompt: "${prompt.slice(0, 50)}..."`);
      
      const systemInstruction = `You are an elite Creative Director at DiGi Trend Creative Operations, an agency specializing in social media campaigns, branding, and performance creative for B2B and B2C clients in India.
When the user gives a brief, provide an innovative, brand-aligned structured creative response.
You MUST output ONLY a valid raw JSON object (no markdown, no extra conversational text) with EXACTLY these keys:
{
  "headline": "A punchy, viral headline or hook (1 sentence)",
  "visualConcept": "Detailed description of the visual artwork, imagery, layout, lighting, color palette, and graphics",
  "caption": "An engaging, ready-to-post social media caption tailored to the platform",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"],
  "cta": "Clear call to action (e.g. link in bio, comment keyword, DM us)",
  "alternateIdea": "An alternative creative angle or post format (e.g. Reel, carousel, behind-the-scenes)"
}`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(6000), // 6-second timeout fallback for instant response
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${systemInstruction}\n\nUser Brief: "${prompt}"\nTarget Client: "${client || 'General Client'}"\nTarget Platform: "${platform}"`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (rawText) {
          // Clean JSON markdown wrapper if present
          let cleaned = rawText.trim();
          if (cleaned.startsWith('```json')) {
            cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
          } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
          }

          try {
            const parsed = JSON.parse(cleaned);
            if (parsed.headline && parsed.caption) {
              console.log('[AI Service] Successfully generated structured output via Google Gemini');
              return {
                headline: parsed.headline,
                visualConcept: parsed.visualConcept || parsed.visual || 'Dynamic branded layout with high contrast aesthetics.',
                caption: parsed.caption,
                hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : (parsed.hashtags ? String(parsed.hashtags).split(' ') : ['#DiGiTrend', '#CreativeOps']),
                cta: parsed.cta || 'Link in bio to learn more.',
                alternateIdea: parsed.alternateIdea || 'Carousel walkthrough breaking down this concept.'
              };
            }
          } catch (jsonErr) {
            console.warn('[AI Service] Failed to parse Gemini JSON output:', jsonErr.message);
          }
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`[AI Service] Gemini API returned status ${response.status}:`, errorData?.error?.message || response.statusText);
      }
    } catch (err) {
      console.warn(`[AI Service] Live AI request error (${err.message}). Using intelligent contextual engine.`);
    }
  }

  // Contextual Dynamic Agency Engine: Produces distinct tailored outputs for different topics
  return buildIntelligentAgencyResponse(prompt, client, platform);
};

function buildIntelligentAgencyResponse(prompt, client, platform) {
  const pLower = (prompt || '').toLowerCase();
  const brand = client || 'DiGi Trend Client';

  // Topic classification
  const isDiwali = pLower.includes('diwali') || pLower.includes('deepavali') || pLower.includes('festival of lights');
  const isNavratri = pLower.includes('navratri') || pLower.includes('garba') || pLower.includes('dandiya');
  const isPlastic = pLower.includes('plastic') || pLower.includes('polymer') || pLower.includes('pipe') || pLower.includes('manufactur');
  const isRealEstate = pLower.includes('real estate') || pLower.includes('leasing') || pLower.includes('property') || pLower.includes('commercial') || pLower.includes('tower');
  const isHashtagsRequest = pLower.includes('hashtag') || pLower.includes('tags');
  const isTech = pLower.includes('software') || pLower.includes('erp') || pLower.includes('saas') || pLower.includes('code') || pLower.includes('app');
  const isBranding = pLower.includes('brand') || pLower.includes('logo') || pLower.includes('identity') || pLower.includes('design');

  if (isHashtagsRequest) {
    const topic = isPlastic ? 'Plastic & Polymer Engineering' : (isRealEstate ? 'Gujarat Commercial Real Estate' : 'Creative Operations');
    return {
      headline: `Top High-Intent Trending Hashtags for ${topic}`,
      visualConcept: 'Clean typography card with violet-to-cyan gradient background, displaying hashtag reach metrics and engagement tier indicators.',
      caption: `Maximize organic discoverability for ${brand} with these curated, high-intent industrial hashtags analyzed for 2026 reach.\n\nSave this post for your next publishing schedule!`,
      hashtags: isPlastic 
        ? ['#GujaratPolymers', '#PlasticManufacturingIndia', '#RajkotIndustrialHub', '#PolymerEngineering', '#IndustrialPlastics', '#MakeInGujarat', '#SustainablePolymers', '#B2BManufacturing', '#FactoryAutomation', '#IndianExports', '#AgroPolymers', '#PlasticIndustryIndia', '#ISO9001Certified', '#QualityExtrusion', '#DiGiTrendCreative']
        : ['#RajkotRealEstate', '#CommercialLeasing2026', '#PremiumWorkspaces', '#GujaratInfrastructure', '#OfficeSpacesRajkot', '#CorporateRealEstate', '#Tier2TechHubs', '#ModernArchitecture', '#RetailLeasing', '#CommercialProperty', '#BusinessHubGujarat', '#RKWorldTower', '#PrimeLocation', '#SmartOffices', '#DiGiTrendOps'],
      cta: 'Double-tap to save this hashtag set for your content team.',
      alternateIdea: 'Turn these hashtags into a carousel guide detailing best practices for hashtag rotation in 2026.'
    };
  }

  if (isRealEstate) {
    return {
      headline: "5-Day Campaign: Architecting Rajkot's Next Commercial Powerhouse.",
      visualConcept: "Architectural 3D perspective rendering: Golden hour sunlight reflecting off the floor-to-ceiling glass facade of a premier corporate tower, highlighting LEED gold certification badges and ample parking.",
      caption: `Why settle for ordinary office spaces when your business deserves a landmark address?\n\nJoin forward-thinking tech enterprises, finance firms, and global consultancies scaling in Rajkot's flagship commercial district.\n\n🏢 Flexible floor plans from 2,500 to 25,000 sq.ft available for immediate fit-outs.`,
      hashtags: ['#CommercialRealEstate', '#RajkotBusinessHub', '#OfficeSpaces2026', '#CorporateLeasing', '#Tier2Growth', '#SmartWorkspaces', '#DiGiTrendOps'],
      cta: "Schedule an exclusive private tour with our leasing team - Link in bio.",
      alternateIdea: "15s Drone hyper-lapse reel showcasing the building exterior, lobby reception, and high-speed elevator access."
    };
  }

  if (isPlastic && isDiwali) {
    return {
      headline: "Shaping Sustainable Brilliance: Where Precision Engineering Meets Festive Light. ✨🪔",
      visualConcept: "A high-contrast cinematic visual: Minimalist golden diyas arranged around precision-engineered translucent polymer components. Soft volumetric lighting highlights the sleek edges, with golden bokeh in the deep slate-blue background. Client branding in the top-right corner.",
      caption: `This Diwali, we celebrate the power of innovation that molds the future. At ${brand}, every component is crafted with relentless quality, sustainability, and purpose.\n\nMay the festival of lights illuminate fresh milestones of growth, strong partnerships, and engineering excellence.\n\n✨ Wishing all our esteemed industry partners, vendors, and clients a prosperous and joyful Diwali!`,
      hashtags: ['#Diwali2026', '#ManufacturingExcellence', '#PlasticEngineering', '#SustainableIndustry', '#MakeInIndia', '#FestiveWishes', '#DiGiTrendCreative'],
      cta: "Explore our certified industrial polymers catalog - Link in bio.",
      alternateIdea: "Behind-the-scenes 15s Reel: Transition from factory molten molding line spark to a glowing golden Diwali diya flame, symbolizing transformation."
    };
  }

  if (isNavratri) {
    return {
      headline: "9 Nights of Energy. 365 Days of Precision & Dedication.",
      visualConcept: "Vibrant dual-tone graphic blending traditional Dandiya neon silhouettes with modern geometric line-work. The client's product icon is subtly embedded into the central mandala motif.",
      caption: `Let the rhythmic beats of Navratri inspire relentless momentum and victory in every project! ${brand} wishes you joyous festivities full of devotion, color, and unstoppable progress.`,
      hashtags: ['#Navratri2026', '#FestivalOfGujarat', '#CreativeDesign', '#BrandMomentum', '#DiGiTrend', '#FestiveVibes'],
      cta: "Share your favorite festive moment with us in the comments below!",
      alternateIdea: "Interactive carousel featuring 9 color-coded slides for each day with tips for business resilience."
    };
  }

  if (isTech) {
    return {
      headline: "Stop Managing Chaos. Start Orchestrating Predictable Growth.",
      visualConcept: "Split-screen visual showing chaotic paper invoices and manual spreadsheets on the left fading into a glowing, clean glassmorphic real-time enterprise analytics dashboard on the right.",
      caption: `In modern operations, speed without accuracy is just faster failure. Discover how ${brand} enables enterprise leaders to automate tedious workflows, track margins in real-time, and scale with confidence.`,
      hashtags: ['#EnterpriseTech', '#WorkflowAutomation', '#ERPSoftware', '#DigitalTransformation', '#BusinessEfficiency', '#DiGiTrend'],
      cta: "Book your personalized 20-minute live architecture demo today.",
      alternateIdea: "Customer spotlight graphic featuring a manufacturing CEO quote with verified 34% cost savings metrics."
    };
  }

  if (isBranding) {
    return {
      headline: "In 2026, If Your Brand Doesn't Stand Out in 3 Seconds, You Don't Exist.",
      visualConcept: "Bold typographic split screen: On the left, a cluttered, muted monochrome Canva-like template with 'Generic Business'. On the right, a striking ultra-violet neon aesthetic with custom typography and spatial layout representing modern authority.",
      caption: `Markets are crowded, attention spans are fleeting, and AI is producing a sea of sameness. The only real moat in 2026? Unapologetic brand distinction.\n\nAt DiGi Trend, we don't just design graphics; we architect unforgettable market perceptions.`,
      hashtags: ['#BrandStrategy2026', '#CreativeOperations', '#DiGiTrendBranding', '#VisualIdentity', '#DesignTrends'],
      cta: "DM 'AUDIT' for a complimentary 15-minute brand teardown of your digital presence.",
      alternateIdea: "Short voiceover video breaking down 3 subtle branding mistakes costing B2B companies deals."
    };
  }

  // Dynamic keyword-driven response for any arbitrary user prompt
  const words = prompt.split(' ').filter(w => w.length > 3).slice(0, 3).join(' ');
  return {
    headline: `Innovative Strategic Angle for "${words || 'Your Creative Campaign'}": Driving High-Impact Resonance.`,
    visualConcept: `Contemporary high-resolution visual layout tailored to "${prompt.slice(0, 40)}...". Features layered glassmorphism, accent lighting in brand colors, and structured typography hierarchy that immediately directs the viewer's eye to the primary value proposition.`,
    caption: `Transforming great ideas into unforgettable market presence. For ${brand}, execution is everything.\n\n"${prompt}"\n\nDiscover how deliberate creative design and calculated brand messaging deliver compounding business results.`,
    hashtags: ['#CreativeStrategy', '#DigitalGrowth', '#ModernBranding', '#DiGiTrendCreative', '#StrategicMarketing', '#ContentExcellence'],
    cta: "Explore the complete campaign blueprint - Link in bio.",
    alternateIdea: "3-part narrative carousel breaking this concept down into Hook, Problem, and Solution."
  };
}

export default { generateCreativeBrief };
