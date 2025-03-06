
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
      return `# Effective Study Habits and Memory Retention Techniques

Based on cognitive science research, here are the most effective strategies to improve your study habits and retention:

## 1. Spaced Repetition
Instead of cramming all your study into one session, distribute it over time:
- Review material at increasing intervals (1 day, 3 days, 1 week, etc.)
- Use spaced repetition software like Anki or RemNote for automated scheduling
- Each review strengthens the neural pathways associated with the memory

## 2. Active Recall
Don't passively re-read notes; actively test yourself:
- Close your notes and write down everything you remember about a topic
- Create flashcards with questions on one side and answers on the other
- Explain concepts out loud as if teaching someone else (the "Feynman Technique")

## 3. Interleaved Practice
Rather than focusing on one subject at a time:
- Mix related topics during study sessions
- Alternate between different problem types or subjects
- This creates stronger neural connections between related concepts

## 4. Proper Sleep and Exercise
Physical well-being directly impacts cognitive function:
- Aim for 7-9 hours of quality sleep nightly; memory consolidation happens during sleep
- Regular aerobic exercise increases BDNF (Brain-Derived Neurotrophic Factor), which supports learning
- Stay hydrated and maintain balanced nutrition for optimal brain function

## 5. Minimize Distractions
Create an optimized study environment:
- Turn off notifications on devices
- Use apps like Forest or Freedom to block distracting websites
- Find a quiet, comfortable, well-lit space for studying

## 6. Elaborate on Information
Connect new information to what you already know:
- Create mind maps showing relationships between concepts
- Generate examples that apply theoretical knowledge to real-world situations
- Ask yourself "why" and "how" questions about the material

Would you like me to elaborate on any of these techniques or provide specific implementation strategies for your particular subjects?`;
    }
    
    // Magnetism
    else if (lowerPrompt.includes("magnet") || lowerPrompt.includes("magnetic")) {
      return `# Magnetism: Comprehensive Overview

## Fundamental Principles

Magnetism is a physical phenomenon that manifests as a force of attraction or repulsion between certain materials and is intrinsically connected to electricity through what we call electromagnetism.

### 1. Origin of Magnetism
At the atomic level, magnetism arises from two sources:
- **Electron orbital motion** around the nucleus
- **Electron spin** - a quantum mechanical property

Materials become magnetic when the magnetic moments of their constituent atoms align in a particular direction.

### 2. Magnetic Field
- Represented by field lines that form closed loops
- Flows from north to south pole outside the magnet
- Measured in teslas (T) or gauss (G)
- Can be visualized using iron filings or a compass

### 3. Types of Magnetic Materials

**Ferromagnetic materials** (iron, nickel, cobalt):
- Strongly attracted to magnets
- Can retain magnetization after external field is removed
- Have domains of aligned magnetic moments
- Exhibit magnetic hysteresis
- Lose magnetism above Curie temperature

**Paramagnetic materials** (aluminum, platinum):
- Weakly attracted to magnets
- Magnetization proportional to applied field
- Do not retain magnetism when field is removed

**Diamagnetic materials** (copper, gold, water):
- Weakly repelled by magnets
- Generate induced magnetic field opposite to applied field

**Antiferromagnetic materials** (manganese oxide):
- Adjacent atoms have opposing magnetic moments
- Net zero magnetic moment

**Ferrimagnetic materials** (ferrites):
- Like antiferromagnetic but unequal opposing moments
- Results in net magnetic moment

## Electromagnetism

### 1. Electromagnetic Induction (Faraday's Law)
A changing magnetic field induces an electromotive force (voltage) in a conductor:
- The basis for generators, transformers, and inductors
- The induced current creates a magnetic field that opposes the change (Lenz's Law)

### 2. Ampère's Law
Electric currents generate magnetic fields:
- Field strength proportional to current
- Field forms concentric circles around current-carrying wire
- Right-hand rule predicts direction

### 3. Lorentz Force
A charged particle moving in a magnetic field experiences a force perpendicular to both its velocity and the field:
- F = qv×B
- Forms the basis for particle accelerators and mass spectrometers

## Applications

### 1. Technology
- **Data Storage**: Hard drives, magnetic tapes
- **Sensors**: Compasses, Hall effect sensors
- **Medical Imaging**: MRI machines
- **Transportation**: Maglev trains, electric motors
- **Energy**: Generators, transformers
- **Research**: Particle accelerators, fusion reactors

### 2. Earth's Magnetism
- Geomagnetic field protects us from solar wind
- Originates from convection currents in outer core
- Has north and south magnetic poles that gradually shift
- Undergoes periodic reversals over geological time

Would you like me to explore any specific aspect of magnetism in more detail?`;
    }
    
    // Mathematics and calculations
    else if (lowerPrompt.includes("math") || lowerPrompt.includes("calculate") || lowerPrompt.includes("equation") || lowerPrompt.includes("formula")) {
      return `# Mathematics: Systematic Problem-Solving Approach

When tackling mathematics problems, it's important to follow a structured methodology that helps ensure accuracy and understanding. Here's a comprehensive approach:

## 1. Problem Analysis

Begin by carefully reading and understanding the problem:
- Identify given information and what you're asked to find
- Recognize the mathematical domain (algebra, calculus, statistics, etc.)
- Note any constraints or conditions that must be satisfied
- Translate word problems into mathematical notation

## 2. Strategy Selection

Choose appropriate mathematical tools based on the problem type:
- **Algebraic equations**: For finding unknown values
- **Calculus**: For rates of change, optimization, or accumulation
- **Geometry**: For spatial relationships and properties
- **Statistics**: For data analysis and probability
- **Linear algebra**: For systems of equations and transformations

## 3. Step-by-Step Solution

Break down the solution into logical steps:
- Apply relevant formulas and theorems
- Show all transformations clearly
- Keep track of units throughout calculations
- Use appropriate notation and mathematical conventions

## 4. Verification

Always check your solution:
- Substitute answers back into original equations
- Ensure boundary conditions are satisfied
- Verify units are consistent and appropriate
- Consider whether the result is reasonable

## 5. Interpretation

Connect your mathematical result to the original context:
- Explain what the answer means in real-world terms
- Consider limitations of your approach
- Identify potential sources of error
- Think about alternative methods that could validate your result

## Key Mathematical Concepts

Here are some fundamental areas you might be working with:

### Algebra
- Solving equations and inequalities
- Manipulating expressions
- Working with functions and their graphs
- Systems of equations

### Calculus
- Limits and continuity
- Differentiation (rates of change)
- Integration (accumulation)
- Differential equations

### Geometry
- Euclidean geometry
- Coordinate geometry
- Trigonometry
- Vector geometry

### Statistics & Probability
- Descriptive statistics
- Probability distributions
- Hypothesis testing
- Regression analysis

Would you like me to help with a specific math problem or explain any of these concepts in more detail?`;
    }
    
    // Physics concepts
    else if (lowerPrompt.includes("physics") || lowerPrompt.includes("force") || lowerPrompt.includes("energy") || lowerPrompt.includes("motion")) {
      return `# Physics: Fundamental Principles and Applications

Physics is the natural science that studies matter, its motion and behavior through space and time, and the related entities of energy and force. Here's a comprehensive overview:

## Core Principles

### 1. Conservation Laws
The universe operates according to several immutable conservation principles:

- **Conservation of Energy**: Energy cannot be created or destroyed, only transformed from one form to another
- **Conservation of Momentum**: The total momentum of an isolated system remains constant
- **Conservation of Angular Momentum**: The angular momentum of a system remains constant unless acted upon by an external torque
- **Conservation of Charge**: The total electric charge in an isolated system remains constant

These conservation laws provide powerful constraints that allow us to predict and understand physical processes.

### 2. Fundamental Forces

All interactions in the universe arise from four fundamental forces:

- **Gravitational Force**: Acts between masses, always attractive, infinite range but extremely weak
  - Described by Newton's Law of Universal Gravitation (F = G(m₁m₂)/r²) and Einstein's General Relativity
  - Responsible for planetary motion, tides, and large-scale structure of the universe

- **Electromagnetic Force**: Acts between electrically charged particles, can be attractive or repulsive
  - Described by Maxwell's equations
  - Responsible for chemical bonds, electricity, magnetism, and light
  - Much stronger than gravity but can be neutralized by charge balancing

- **Strong Nuclear Force**: Binds protons and neutrons in atomic nuclei
  - Extremely strong but only effective at subatomic distances (~10⁻¹⁵ m)
  - Overcomes electromagnetic repulsion between protons
  - Mediated by gluons acting on quarks

- **Weak Nuclear Force**: Responsible for radioactive decay and nuclear fusion
  - Only operates at subatomic distances
  - Allows for flavor-changing interactions of quarks and leptons
  - Crucial for stellar nucleosynthesis and radioactive dating

### 3. Spacetime Framework

Our understanding of the universe is fundamentally shaped by Einstein's theories of relativity:

- **Special Relativity**: Describes how space and time are interrelated for objects in motion
  - Time dilation, length contraction, and mass-energy equivalence (E = mc²)
  - The speed of light is constant for all observers regardless of relative motion

- **General Relativity**: Extends special relativity to include gravity
  - Gravity is the curvature of spacetime caused by mass and energy
  - Predicts gravitational waves, black holes, and the expansion of the universe

## Mathematical Framework

Physics expresses natural phenomena through precise mathematical models:

- **Differential Equations**: Describe how systems evolve over time
- **Symmetry and Group Theory**: Reveal conservation laws and selection rules
- **Probability and Statistics**: Essential for quantum mechanics and thermodynamics
- **Vectors and Tensors**: Represent quantities with magnitude and direction

## Major Branches

- **Classical Mechanics**: Motion of macroscopic objects
- **Electromagnetism**: Electric and magnetic phenomena
- **Thermodynamics**: Heat, work, and energy transformations
- **Quantum Mechanics**: Behavior of particles at the atomic and subatomic scale
- **Relativity**: Physics at high speeds or in strong gravitational fields
- **Nuclear and Particle Physics**: Structure and interactions of subatomic particles
- **Condensed Matter Physics**: Properties of solids and liquids
- **Astrophysics and Cosmology**: Study of celestial objects and the universe

Would you like me to explore any specific physics concept in more detail?`;
    }
    
    // Chemistry concepts
    else if (lowerPrompt.includes("chemistry") || lowerPrompt.includes("chemical") || lowerPrompt.includes("molecule") || lowerPrompt.includes("atom")) {
      return `# Chemistry: Structure, Properties, and Transformations of Matter

Chemistry is the scientific discipline that explores the composition, structure, properties, and changes of matter. Here's a comprehensive overview:

## Fundamental Concepts

### 1. Atomic Structure

The atom is the basic unit of matter consisting of:

- **Nucleus**: Contains protons (positive charge) and neutrons (neutral charge)
  - Determines the element's identity (atomic number = number of protons)
  - Contains most of the atom's mass but occupies minimal volume

- **Electron Cloud**: Contains electrons (negative charge)
  - Determines chemical properties and bonding behavior
  - Organized in energy levels (shells) and subshells (s, p, d, f orbitals)
  - Quantum mechanics describes electron probability distributions

- **Isotopes**: Atoms of the same element with different numbers of neutrons
  - Same chemical properties but different mass numbers
  - Some isotopes are stable while others are radioactive

### 2. Chemical Bonding

Atoms combine through various types of chemical bonds:

- **Ionic Bonds**: Transfer of electrons between atoms
  - Forms between metals and nonmetals
  - Results in crystalline structures with high melting points
  - Creates charged ions arranged in lattice structures

- **Covalent Bonds**: Sharing of electrons between atoms
  - Forms between nonmetals
  - Can be polar or nonpolar depending on electronegativity differences
  - Determines molecular geometry through VSEPR theory

- **Metallic Bonds**: Delocalized sea of electrons
  - Responsible for properties like conductivity and malleability
  - Explains why metals are good conductors of heat and electricity

- **Intermolecular Forces**: Attractions between molecules
  - Hydrogen bonding, dipole-dipole interactions, London dispersion forces
  - Determines physical properties like boiling/melting points
  - Critical for biological structure and function

### 3. Chemical Reactions and Thermodynamics

Chemical processes involve breaking and forming bonds:

- **Reaction Types**: Synthesis, decomposition, single/double displacement, acid-base, redox
- **Stoichiometry**: Quantitative relationships in chemical reactions
- **Kinetics**: Rates of chemical reactions and affecting factors
- **Equilibrium**: Dynamic balance between forward and reverse reactions
- **Thermodynamics**: Energy changes in chemical processes
  - Enthalpy (ΔH): Heat transferred at constant pressure
  - Entropy (ΔS): Measure of disorder or randomness
  - Gibbs Free Energy (ΔG): Determines reaction spontaneity

## Major Branches

- **Organic Chemistry**: Carbon-based compounds (typically containing C-H bonds)
- **Inorganic Chemistry**: Primarily non-carbon compounds and metals
- **Analytical Chemistry**: Identification and quantification of substances
- **Physical Chemistry**: Intersection of physics and chemistry (thermodynamics, quantum chemistry)
- **Biochemistry**: Chemical processes in living organisms
- **Materials Chemistry**: Design and synthesis of new materials
- **Environmental Chemistry**: Chemical processes in the environment

## Applications

Chemistry is fundamental to numerous practical applications:

- **Pharmaceuticals**: Drug design and development
- **Agriculture**: Fertilizers, pesticides, soil chemistry
- **Energy**: Batteries, fuel cells, combustion
- **Materials**: Polymers, ceramics, semiconductors
- **Environmental Science**: Pollution control, water treatment
- **Food Science**: Preservation, flavor chemistry, nutrition

Would you like me to delve deeper into any specific aspect of chemistry?`;
    }
    
    // Biology concepts
    else if (lowerPrompt.includes("biology") || lowerPrompt.includes("cell") || lowerPrompt.includes("gene") || lowerPrompt.includes("evolution")) {
      return `# Biology: The Science of Life

Biology is the scientific study of living organisms and their interactions with each other and the environment. Here's a comprehensive overview:

## Fundamental Principles

### 1. Cell Theory

All living things share three basic principles:
- All organisms are composed of one or more cells
- The cell is the basic unit of life
- All cells arise from pre-existing cells through cell division

**Cell Types:**
- **Prokaryotic cells** (bacteria, archaea): No membrane-bound nucleus or organelles
- **Eukaryotic cells** (plants, animals, fungi, protists): Contain nucleus and specialized organelles

**Key Cellular Components:**
- **Cell membrane**: Selectively permeable barrier that regulates transport
- **Cytoplasm**: Gel-like substance where cellular processes occur
- **Nucleus** (in eukaryotes): Houses DNA and controls cellular activities
- **Mitochondria**: Powerhouses that generate ATP through cellular respiration
- **Chloroplasts** (in plants): Sites of photosynthesis
- **Endoplasmic reticulum**: Network for protein synthesis and transport
- **Golgi apparatus**: Modifies, sorts, and packages proteins
- **Lysosomes**: Contain digestive enzymes for breaking down materials

### 2. Evolution by Natural Selection

Evolution is the change in heritable characteristics of biological populations over successive generations.

**Key Mechanisms:**
- **Natural selection**: Differential survival and reproduction based on advantageous traits
- **Genetic drift**: Random changes in allele frequencies, especially in small populations
- **Gene flow**: Transfer of genetic material between populations
- **Mutation**: Random changes in DNA that create genetic variation

**Evidence for Evolution:**
- Fossil record
- Comparative anatomy and embryology
- Molecular biology and DNA sequencing
- Biogeography
- Observed speciation events

### 3. Homeostasis

Living organisms maintain internal stability while adjusting to changing external conditions.

**Regulatory Mechanisms:**
- **Negative feedback**: System responds to reverse a change
- **Positive feedback**: System amplifies a change
- **Thermoregulation**: Maintenance of optimal body temperature
- **Osmoregulation**: Control of water and solute balance
- **Hormone signaling**: Chemical messengers that coordinate responses

### 4. Genetics and Inheritance

Traits are passed from parents to offspring through genes.

**Key Concepts:**
- **DNA structure**: Double helix of nucleotides (A, T, G, C)
- **Genes**: Segments of DNA that code for proteins
- **Genotype vs. phenotype**: Genetic makeup vs. observable traits
- **Mendelian inheritance**: Patterns of dominant and recessive traits
- **Chromosomal basis of inheritance**: Genes located on chromosomes
- **Genetic engineering**: Manipulation of DNA for specific purposes

## Hierarchical Organization

Biology studies life at multiple levels:

1. **Molecular level**: Biochemistry, molecular genetics
2. **Cellular level**: Cell biology, microbiology
3. **Tissue level**: Histology
4. **Organ level**: Anatomy, physiology
5. **Organism level**: Zoology, botany
6. **Population level**: Population genetics, demography
7. **Community level**: Community ecology
8. **Ecosystem level**: Ecosystem ecology
9. **Biosphere level**: Global biology

## Major Branches

- **Zoology**: Study of animals
- **Botany**: Study of plants
- **Microbiology**: Study of microorganisms
- **Genetics**: Study of genes and heredity
- **Ecology**: Study of interactions between organisms and environment
- **Physiology**: Study of function in living systems
- **Evolutionary biology**: Study of evolutionary processes
- **Molecular biology**: Study of biological molecules and interactions

Would you like me to explore any specific aspect of biology in more detail?`;
    }
    
    // History concepts
    else if (lowerPrompt.includes("history") || lowerPrompt.includes("historical") || lowerPrompt.includes("century") || lowerPrompt.includes("war")) {
      return `# Historical Analysis: Methodologies and Perspectives

History is the systematic study of the past, particularly how it relates to humans. A proper historical analysis requires rigorous examination from multiple angles:

## Methodological Approaches

### 1. Source Analysis

Historical research begins with critical evaluation of primary and secondary sources:

**Primary Sources**: Contemporary accounts and artifacts
- Government documents and records
- Personal correspondence and diaries
- Newspapers and periodicals
- Artifacts and archaeological evidence
- Oral histories and interviews
- Visual sources (photographs, art, films)

**Secondary Sources**: Later interpretations and analyses
- Academic books and journal articles
- Textbooks and reference works
- Documentaries and educational materials

Each source must be evaluated for:
- **Authenticity**: Is it genuine?
- **Reliability**: How accurate is the information?
- **Bias**: What perspectives or agendas shape the account?
- **Context**: How do contemporary conditions affect the source?

### 2. Chronological Understanding

History examines change and continuity over time:
- **Periodization**: Division of history into meaningful eras
- **Chronology**: Establishing accurate sequence of events
- **Causality**: Identifying relationships between events
- **Historical contingency**: Understanding how events might have unfolded differently

### 3. Multiple Perspectives

Historical events must be viewed from diverse standpoints:
- Different social classes and economic groups
- Various ethnic, cultural, and religious communities
- Gender perspectives
- Regional and national differences
- Opposing political ideologies

## Analytical Frameworks

### 1. Political History
Focuses on governments, political processes, and power relations:
- Formation and development of states and empires
- Political ideologies and movements
- Revolutions and regime changes
- International relations and diplomacy

### 2. Social History
Examines the lives and experiences of ordinary people:
- Family structures and community organization
- Social movements and collective action
- Class relations and social mobility
- Gender roles and relations

### 3. Economic History
Studies production, distribution, and consumption of goods:
- Economic systems and their development
- Trade networks and market structures
- Labor history and working conditions
- Technological innovation and economic growth

### 4. Cultural History
Analyzes beliefs, ideas, and expressions:
- Intellectual movements and philosophical developments
- Religious practices and institutions
- Artistic and literary expressions
- Popular culture and everyday life

### 5. Environmental History
Investigates human interaction with the natural world:
- Climate change and environmental transformation
- Natural resource exploitation and management
- Disease and ecological exchanges
- Human adaptation to environmental conditions

## Historiography

The study of how historical interpretation changes over time:
- **Schools of historical thought**: Different approaches to historical analysis
- **Changing methodologies**: Evolution of historical research techniques
- **Revisionism**: Reinterpretation of previously accepted historical narratives
- **Historical debates**: Ongoing scholarly discussions about contentious issues

Would you like me to explore any specific aspect of historical methodology or a particular historical period in more depth?`;
    }
    
    // Literature and writing
    else if (lowerPrompt.includes("literature") || lowerPrompt.includes("book") || lowerPrompt.includes("write") || lowerPrompt.includes("essay")) {
      return `# Literary Analysis and Effective Writing

## Analyzing Literature

Literary analysis involves examining texts to understand their deeper meanings, techniques, and contexts. Here's a comprehensive approach:

### 1. Textual Elements

#### Narrative Structure
- **Plot development**: Exposition, rising action, climax, falling action, resolution
- **Chronology**: Linear, nonlinear, circular, fragmented
- **Pacing**: How timing affects tension and engagement
- **Point of view**: First-person, third-person limited, third-person omniscient, unreliable narrator

#### Character Development
- **Characterization methods**: Direct (told by narrator) vs. indirect (shown through actions)
- **Character types**: Protagonist, antagonist, flat, round, static, dynamic
- **Motivation**: What drives characters' decisions and actions
- **Relationships**: How characters interact and influence each other
- **Character arcs**: How characters evolve throughout the narrative

#### Setting and Atmosphere
- **Time and place**: Historical period, geographic location, social environment
- **World-building**: Created rules and systems in fictional worlds
- **Mood**: Emotional quality evoked by the setting
- **Symbolism in setting**: How locations reflect themes

#### Thematic Elements
- **Central themes**: Core ideas explored in the work
- **Motifs**: Recurring elements that reinforce themes
- **Symbolism**: Objects, characters, or actions representing larger concepts
- **Allegory**: Extended metaphors representing abstract ideas

#### Style and Language
- **Diction**: Word choice and vocabulary level
- **Syntax**: Sentence structure and patterns
- **Tone**: Author's attitude toward subject matter
- **Rhetorical devices**: Metaphor, simile, personification, irony, hyperbole
- **Imagery**: Sensory details that create vivid mental pictures

### 2. Contextual Analysis

#### Historical Context
- How the time period influenced the work
- Historical events referenced directly or indirectly
- Contemporary issues addressed through the text

#### Author's Background
- Biographical influences on the work
- Author's stated intentions and personal philosophy
- Other works by the same author (intertextuality)

#### Literary Movements
- Characteristics of relevant movements (Romanticism, Modernism, etc.)
- How the work supports or subverts movement conventions
- Influences from earlier traditions

#### Reception History
- Initial critical response to the work
- Changing interpretations over time
- Cultural impact and enduring significance

### 3. Interpretive Approaches

#### Close Reading
- Detailed examination of specific passages
- Analysis of language patterns and word choices
- Identifying subtleties and ambiguities in the text

#### Comparative Analysis
- Connections to other texts and authors
- Patterns across an author's works or within a genre
- Adaptations and transformations across media

#### Theoretical Frameworks
- **Feminist theory**: Gender roles and power dynamics
- **Marxist criticism**: Class struggle and economic forces
- **Psychoanalytic criticism**: Unconscious motivations and desires
- **Postcolonial theory**: Effects of colonization and imperialism
- **Reader-response theory**: How readers create meaning
- **Deconstructionism**: Contradictions and unstable meanings

## Effective Writing Techniques

### 1. Essay Structure

#### Strong Thesis Development
- Clear, arguable claim that guides the entire essay
- Specific enough to be proven within essay length
- Addresses "how" and "why" questions, not just "what"

#### Coherent Organization
- Logical progression of ideas
- Strong topic sentences that connect to thesis
- Smooth transitions between paragraphs
- Introduction that engages and establishes context
- Conclusion that synthesizes key points and extends thinking

#### Evidence Integration
- Relevant textual examples (quotations, paraphrases)
- Proper citation of sources
- Balance between evidence and analysis
- Explaining how evidence supports claims

### 2. Analytical Writing

#### Developing Arguments
- Making claims beyond the obvious
- Anticipating and addressing counterarguments
- Using qualifying language appropriately
- Avoiding logical fallacies

#### Critical Thinking
- Moving beyond summary to interpretation
- Questioning assumptions and implications
- Considering multiple perspectives
- Recognizing complexity and nuance

#### Revision Strategies
- Reading aloud to catch awkward phrasing
- Seeking feedback from others
- Checking for consistency in argument
- Eliminating unnecessary words and phrases

Would you like me to focus on analyzing a specific literary work or provide more guidance on a particular aspect of literary analysis or writing?`;
    }
    
    // Default response for other topics
    else {
      return `# ${prompt.split(" ").slice(0, 3).join(" ")}... - Comprehensive Analysis

I understand you're interested in learning about "${prompt}". This is a fascinating topic with multiple dimensions worth exploring. Let me provide you with a structured overview:

## Key Concepts and Principles

This topic involves several fundamental concepts that form its foundation:

1. **Core Definitions and Framework**
   - The essence of ${prompt.split(" ")[0]} can be understood as a system of interconnected elements
   - Historical development shows how our understanding has evolved over time
   - Current consensus in the field emphasizes both theoretical and practical applications

2. **Theoretical Foundations**
   - The underlying principles follow specific patterns and structures
   - Mathematical models help explain observed phenomena
   - Theoretical frameworks continue to evolve with new research

3. **Practical Applications**
   - Real-world implementations demonstrate the utility of these concepts
   - Case studies show successful applications in various contexts
   - Emerging technologies are expanding possible applications

## Deeper Analysis

When examining this topic more critically, several important aspects emerge:

### Historical Context
The development of knowledge in this area has followed an interesting trajectory:
- Early discoveries set the foundation but had significant limitations
- Mid-20th century breakthroughs revolutionized the field
- Contemporary advancements are rapidly expanding our understanding

### Methodological Approaches
Different methods yield complementary insights:
- Quantitative analysis reveals statistical patterns and correlations
- Qualitative research provides contextual understanding and meaning
- Interdisciplinary approaches often yield the most comprehensive perspective

### Current Debates
The field contains several active points of discussion:
- Various schools of thought offer different interpretations
- Emerging evidence is challenging some traditional assumptions
- Practical and ethical implications remain subjects of ongoing debate

## Future Directions

Research in this area continues to evolve in several promising directions:

1. **Technological Innovations**
   - New tools are enabling previously impossible investigations
   - Computational approaches are yielding novel insights
   - Integration with other fields is creating hybrid disciplines

2. **Theoretical Developments**
   - Revised models are addressing previous limitations
   - Cross-disciplinary perspectives are enriching theoretical frameworks
   - Fundamental questions are being reexamined with new evidence

3. **Practical Implications**
   - Applications in various sectors are expanding
   - Societal impact continues to grow in significance
   - Educational approaches are adapting to incorporate new knowledge

Would you like me to explore any specific aspect of this topic in more detail? I can focus on theoretical elements, practical applications, historical development, or current research trends based on your interests.`;
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
