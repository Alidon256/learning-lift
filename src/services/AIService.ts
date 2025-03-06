
import { toast } from "@/components/ui/use-toast";

class AIService {
  private apiKey: string | null = null;
  private contextHistory: Array<{ role: "user" | "assistant", content: string }> = [];
  
  // Set API key for Gemini
  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('gemini_api_key', key);
    return true;
  }
  
  // Get API key from localStorage
  getApiKey() {
    if (this.apiKey) return this.apiKey;
    
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      this.apiKey = storedKey;
      return storedKey;
    }
    
    return null;
  }
  
  // Clear API key
  clearApiKey() {
    this.apiKey = null;
    localStorage.removeItem('gemini_api_key');
  }
  
  // Check if API key is set
  hasApiKey() {
    return !!this.getApiKey();
  }
  
  // Clear context history
  clearHistory() {
    this.contextHistory = [];
  }
  
  // Update context with new messages
  updateContext(role: "user" | "assistant", content: string) {
    this.contextHistory.push({ role, content });
    // Keep context history limited to last 15 messages for better context
    if (this.contextHistory.length > 15) {
      this.contextHistory = this.contextHistory.slice(-15);
    }
  }
  
  // Send a query to Gemini API with context
  async queryGemini(prompt: string) {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set your Gemini API key in settings.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      // Add user message to context
      this.updateContext("user", prompt);
      
      // In real implementation, we would send the context history to get more accurate responses
      console.log("Sending to Gemini API with context:", this.contextHistory);
      console.log("Using API key:", apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length - 4));
      
      // For demo purposes - simulate API interaction
      // In production, this would be an actual API call
      /*
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: this.contextHistory.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
          })),
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });
      
      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      */
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate specific responses based on the query
      let responseText = this.generateSpecificResponse(prompt);
      
      // Add assistant response to context
      this.updateContext("assistant", responseText);
      
      return {
        text: responseText,
      };
    } catch (error) {
      console.error("Error querying Gemini:", error);
      toast({
        title: "API Error",
        description: "Failed to get a response from Gemini API.",
        variant: "destructive",
      });
      return null;
    }
  }
  
  // Generate specific responses based on the query topic
  private generateSpecificResponse(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    // Study habits and retention
    if (lowerPrompt.includes("study habit") || lowerPrompt.includes("retention") || lowerPrompt.includes("memorization")) {
      return `Here are effective strategies to improve your study habits and retention:\n\n
1. **Spaced Repetition** - Instead of cramming, space out your study sessions over time. Review material at increasing intervals (1 day, 3 days, 1 week, etc.).

2. **Active Recall** - Test yourself instead of passively re-reading. Close your book and try to recall key concepts.

3. **The Pomodoro Technique** - Study in focused 25-minute blocks with 5-minute breaks between them.

4. **Dual Coding** - Combine verbal and visual learning by creating diagrams, mind maps, or visual metaphors for concepts.

5. **Teaching/Explaining** - Explain concepts out loud as if teaching someone else. This forces deeper processing.

6. **Interleaved Practice** - Mix up related topics rather than focusing on one subject at a time.

7. **Proper Sleep** - Ensure 7-9 hours of quality sleep. Memory consolidation happens during sleep cycles.

8. **Environment Optimization** - Create a dedicated, distraction-free study space with good lighting and minimal noise.

9. **Connect to Prior Knowledge** - Relate new information to concepts you already understand.

10. **Retrieval Practice** - Regularly quiz yourself without looking at your notes.

Would you like me to elaborate on any of these specific techniques?`;
    }
    
    // Magnetism
    else if (lowerPrompt.includes("magnet") || lowerPrompt.includes("magnetic")) {
      return `# Magnetism: Fundamental Concepts and Applications

Magnetism is a fundamental force of nature that arises from the motion of electric charges. Here's a comprehensive overview:

## Core Principles

1. **Magnetic Fields**: Invisible fields that exert forces on moving charges, magnetic materials, and other magnetic fields.

2. **Magnetic Poles**: Every magnet has a north and south pole. Like poles repel, opposite poles attract.

3. **Electromagnetic Relationship**: Electricity and magnetism are intrinsically connected. Moving electric charges produce magnetic fields.

## Types of Magnetic Materials

1. **Ferromagnetic**: Materials strongly attracted to magnets (iron, nickel, cobalt)
2. **Paramagnetic**: Weakly attracted to magnetic fields
3. **Diamagnetic**: Weakly repelled by magnetic fields
4. **Antiferromagnetic**: Atoms aligned in an alternating pattern
5. **Ferrimagnetic**: Complex alignment with unequal opposing magnetic moments

## Key Concepts

- **Magnetic Domains**: Regions within a material where atomic magnetic moments align
- **Magnetic Flux**: Measure of the total magnetic field passing through a given area
- **Magnetic Field Strength (H)**: Measured in amperes per meter
- **Magnetic Flux Density (B)**: Measured in teslas

## Applications

- **Electric Motors and Generators**: Convert between electrical and mechanical energy
- **Magnetic Storage**: Hard drives, magnetic tapes
- **MRI Machines**: Medical imaging using strong magnetic fields
- **Maglev Trains**: Use magnetic levitation for high-speed transport
- **Particle Accelerators**: Guide charged particles using powerful magnets

Would you like me to elaborate on a specific aspect of magnetism, such as quantum magnetism, Earth's magnetic field, or practical applications?`;
    }
    
    // Mathematics and calculations
    else if (lowerPrompt.includes("math") || lowerPrompt.includes("calculate") || lowerPrompt.includes("equation") || lowerPrompt.includes("formula")) {
      return `I'd be happy to help with your math question about "${prompt.replace(/math|calculate|equation|formula/gi, "").trim()}".\n\n
Mathematics is a precise discipline, so I'll approach this systematically:

1. **First Principles**: Let's identify the core mathematical concepts involved
2. **Relevant Formulas**: We'll determine which equations apply to this situation
3. **Step-by-Step Solution**: I'll break down the process methodically
4. **Verification**: We'll check our answer with a different approach if possible

When solving mathematical problems, it's important to understand not just the "how" but the "why" behind each step. This builds deeper comprehension.

To provide the most accurate help, could you share the specific problem you're working on? If it's a particular type of equation, concept, or calculation, I can offer targeted guidance with examples.`;
    }
    
    // Physics concepts
    else if (lowerPrompt.includes("physics") || lowerPrompt.includes("force") || lowerPrompt.includes("energy") || lowerPrompt.includes("motion")) {
      return `# Physics: Understanding ${prompt.replace(/physics|force|energy|motion/gi, "").trim()}

Physics helps us understand the fundamental laws that govern the universe. Here's an overview of key concepts related to your question:

## Fundamental Principles

1. **Conservation Laws**: Energy, momentum, and angular momentum cannot be created or destroyed, only transformed.

2. **Fundamental Forces**:
   - Gravitational force (attraction between masses)
   - Electromagnetic force (between charged particles)
   - Strong nuclear force (binds protons and neutrons)
   - Weak nuclear force (responsible for radioactive decay)

3. **Space-Time Relationship**: Special and General Relativity describe how mass, energy, space, and time are interconnected.

## Mathematical Framework

Physics expresses natural phenomena through precise mathematical models that allow us to:
- Predict future states of systems
- Explain observed phenomena
- Develop new technologies

## Applications

From quantum computers to renewable energy systems, understanding physics principles drives technological innovation.

Would you like me to focus on a specific aspect of this topic, such as the mathematical formulas, real-world applications, or historical development of these concepts?`;
    }
    
    // Chemistry concepts
    else if (lowerPrompt.includes("chemistry") || lowerPrompt.includes("chemical") || lowerPrompt.includes("molecule") || lowerPrompt.includes("atom")) {
      return `# Chemistry: Understanding ${prompt.replace(/chemistry|chemical|molecule|atom/gi, "").trim()}

Chemistry explores the properties, composition, and transformations of matter. Here's a structured overview of your topic:

## Fundamental Concepts

1. **Atomic Structure**: 
   - Protons, neutrons, and electrons
   - Atomic number and mass number
   - Isotopes and electron configurations

2. **Chemical Bonding**:
   - Ionic bonds (electron transfer)
   - Covalent bonds (electron sharing)
   - Metallic bonds (electron sea model)
   - Intermolecular forces (hydrogen bonding, van der Waals)

3. **Reactions and Thermodynamics**:
   - Chemical equilibrium
   - Reaction kinetics
   - Enthalpy, entropy, and free energy changes

## Key Principles

- **Periodic Trends**: Properties follow patterns across the periodic table
- **Stoichiometry**: Quantitative relationships in chemical reactions
- **Acid-Base Interactions**: Proton transfer and pH

## Applications

From developing new materials to understanding biological processes, chemistry provides crucial insights into matter's behavior at the molecular level.

Would you like me to elaborate on any of these aspects or focus on specific applications relevant to your interests?`;
    }
    
    // Biology concepts
    else if (lowerPrompt.includes("biology") || lowerPrompt.includes("cell") || lowerPrompt.includes("gene") || lowerPrompt.includes("evolution")) {
      return `# Biology: Understanding ${prompt.replace(/biology|cell|gene|evolution/gi, "").trim()}

Biology is the study of living organisms and their interactions with each other and the environment. Here's an overview of key concepts related to your question:

## Fundamental Principles

1. **Cell Theory**: All living things are composed of cells, cells come from pre-existing cells, and the cell is the basic unit of life.

2. **Evolution**: Populations change over time through natural selection, genetic drift, and gene flow. This explains the diversity of life.

3. **Homeostasis**: Living organisms maintain internal stability while adjusting to changing external conditions.

4. **Energy Flow**: Organisms capture, transform, and use energy from their environment to maintain life.

## Key Processes

- **Metabolism**: Chemical reactions that sustain life
- **Reproduction**: Production of new individuals
- **Growth and Development**: Changes throughout an organism's lifespan
- **Response to Environment**: Adaptations to environmental stimuli

## Hierarchical Organization

Biology studies life at multiple levels:
- Molecular and cellular level
- Tissue and organ level
- Organism level
- Population and ecosystem level

Would you like me to focus on a specific aspect of this topic, such as molecular mechanisms, evolutionary processes, or ecological relationships?`;
    }
    
    // History concepts
    else if (lowerPrompt.includes("history") || lowerPrompt.includes("historical") || lowerPrompt.includes("century") || lowerPrompt.includes("war")) {
      return `# Historical Analysis: ${prompt.replace(/history|historical|century|war/gi, "").trim()}

Understanding historical events requires examining multiple perspectives, contexts, and causalities. Here's an analysis of your topic:

## Key Factors to Consider

1. **Chronological Context**: 
   - When did these events occur?
   - What preceded and followed them?
   - How does this fit into broader historical periods?

2. **Multiple Perspectives**:
   - Different social classes and groups experienced events differently
   - Primary sources often reflect biases of their creators
   - Historiography shows how interpretations change over time

3. **Causality and Significance**:
   - Short-term triggers vs. long-term causes
   - Intended vs. unintended consequences
   - Lasting impact and historical significance

## Historical Methods

Historians use various approaches:
- Analysis of primary and secondary sources
- Comparative studies across regions and time periods
- Interdisciplinary methods incorporating economics, sociology, anthropology, etc.

Would you like me to focus on a specific time period, geographic region, or methodological approach to this historical topic?`;
    }
    
    // Literature and writing
    else if (lowerPrompt.includes("literature") || lowerPrompt.includes("book") || lowerPrompt.includes("write") || lowerPrompt.includes("essay")) {
      return `# Literary Analysis: ${prompt.replace(/literature|book|write|essay/gi, "").trim()}

Literature offers windows into human experience through artistic expression. Here's an analysis framework for your topic:

## Key Elements to Consider

1. **Textual Components**:
   - Narrative structure and plot development
   - Character development and relationships
   - Setting and atmosphere
   - Themes and motifs
   - Symbolism and imagery
   - Style, tone, and literary devices

2. **Contextual Factors**:
   - Historical and cultural context
   - Author's biography and intentions
   - Literary movements and influences
   - Reception and critical response over time

3. **Interpretive Approaches**:
   - Close reading and textual analysis
   - Reader-response theory
   - Psychological perspectives
   - Sociopolitical readings
   - Comparative analysis with other works

## Writing Process

For academic writing about literature:
- Develop a clear thesis with specific evidence
- Organize arguments logically with smooth transitions
- Integrate quotes effectively with proper citation
- Consider counterarguments to strengthen your position

Would you like to focus on analyzing a specific work, discussing writing techniques, or exploring particular literary theories?`;
    }
    
    // Default response for other topics
    else {
      return `Thank you for your question about "${prompt}".\n\n
I can provide you with detailed information about this topic. Here's a structured overview:

## Key Concepts

1. **Fundamental Principles**: 
   - The topic of ${prompt} involves several core principles that provide the foundation for understanding
   - These concepts include [relevant fundamentals based on the topic]
   - Understanding these basics is essential before exploring more complex aspects

2. **Important Relationships and Patterns**:
   - How different elements of this topic interact and influence each other
   - Patterns that have been observed through research and study
   - Exceptions to these patterns and why they occur

3. **Practical Applications**:
   - How this knowledge is applied in real-world contexts
   - Benefits and limitations of current applications
   - Emerging uses and future possibilities

## Current Understanding

The field's current understanding of ${prompt} has evolved through [historical development], with significant contributions from [key figures or research].

## Questions to Consider

- What specific aspects of ${prompt} are you most interested in exploring?
- Are you looking for theoretical understanding or practical applications?
- Is there a particular context or use case you're considering?

I can provide more detailed information on any of these aspects based on your interests.`;
    }
  }
  
  // Generate lecture summaries
  async generateLectureSummary(transcript: string) {
    return this.queryGemini(`Summarize the following lecture transcript and highlight key points, concepts, and terminology:\n\n${transcript}`);
  }
  
  // Generate study questions
  async generateStudyQuestions(topic: string) {
    return this.queryGemini(`Generate 5 comprehensive study questions about ${topic} that would be suitable for a university-level exam.`);
  }
  
  // Explain complex topics
  async explainConcept(concept: string) {
    return this.queryGemini(`Explain the concept of ${concept} in simple terms, then provide a more advanced explanation with examples.`);
  }
}

export const aiService = new AIService();
