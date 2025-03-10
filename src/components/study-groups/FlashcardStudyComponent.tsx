
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudyGroupFlashcardDeck } from "@/models/StudyGroup";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shuffle, 
  RotateCcw,
  ChevronLeft, 
  ChevronRight, 
  ThumbsUp, 
  ThumbsDown,
  Plus
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface FlashcardStudyComponentProps {
  decks: StudyGroupFlashcardDeck[];
  canCreate?: boolean;
  onCreateDeck?: () => void;
}

const FlashcardStudyComponent = ({ 
  decks, 
  canCreate = false,
  onCreateDeck
}: FlashcardStudyComponentProps) => {
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<string[]>([]);
  const [notKnownCards, setNotKnownCards] = useState<string[]>([]);
  const { toast } = useToast();

  const activeDeck = decks.find(deck => deck.id === activeDeckId);
  
  useEffect(() => {
    if (decks.length > 0 && !activeDeckId) {
      setActiveDeckId(decks[0].id);
    }
  }, [decks, activeDeckId]);
  
  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setKnownCards([]);
    setNotKnownCards([]);
  }, [activeDeckId]);
  
  const handleNextCard = () => {
    if (!activeDeck) return;
    
    if (currentCardIndex < activeDeck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      // End of deck
      toast({
        title: "End of deck reached!",
        description: `You've completed the deck. Known: ${knownCards.length}, Not known: ${notKnownCards.length}`,
      });
    }
  };
  
  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };
  
  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleKnown = () => {
    if (!activeDeck) return;
    
    const currentCardId = activeDeck.cards[currentCardIndex].id;
    if (!knownCards.includes(currentCardId)) {
      setKnownCards([...knownCards, currentCardId]);
    }
    handleNextCard();
  };
  
  const handleNotKnown = () => {
    if (!activeDeck) return;
    
    const currentCardId = activeDeck.cards[currentCardIndex].id;
    if (!notKnownCards.includes(currentCardId)) {
      setNotKnownCards([...notKnownCards, currentCardId]);
    }
    handleNextCard();
  };
  
  const handleShuffle = () => {
    if (!activeDeck) return;
    
    setCurrentCardIndex(0);
    setIsFlipped(false);
    toast({
      title: "Cards shuffled",
      description: "The flashcards have been shuffled into a random order",
    });
  };
  
  const handleReset = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setKnownCards([]);
    setNotKnownCards([]);
    toast({
      title: "Study session reset",
      description: "Your progress has been reset",
    });
  };
  
  const getProgressPercentage = () => {
    if (!activeDeck) return 0;
    return ((currentCardIndex + 1) / activeDeck.cards.length) * 100;
  };
  
  return (
    <div className="space-y-4">
      <Tabs 
        value={activeDeckId || ""} 
        onValueChange={setActiveDeckId} 
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            {decks.map(deck => (
              <TabsTrigger 
                key={deck.id} 
                value={deck.id}
                className="relative px-4 py-2"
              >
                {deck.title}
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/3 bg-primary text-primary-foreground rounded-full text-xs px-1.5">
                  {deck.cards.length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {canCreate && (
            <Button 
              onClick={onCreateDeck} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> New Deck
            </Button>
          )}
        </div>
        
        {decks.map(deck => (
          <TabsContent key={deck.id} value={deck.id} className="mt-0">
            {deck.cards.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="font-medium">{deck.title}</h3>
                    <p className="text-sm text-muted-foreground">{deck.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={handleShuffle}
                    >
                      <Shuffle className="h-4 w-4" /> Shuffle
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={handleReset}
                    >
                      <RotateCcw className="h-4 w-4" /> Reset
                    </Button>
                  </div>
                </div>
                
                <div className="relative h-64">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isFlipped ? "back" : "front"}
                      initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Card
                        className="h-full flex items-center justify-center cursor-pointer"
                        onClick={handleFlipCard}
                      >
                        <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">
                            {isFlipped ? "ANSWER" : "QUESTION"}
                          </h4>
                          <p className="text-xl font-medium">
                            {isFlipped 
                              ? deck.cards[currentCardIndex].back 
                              : deck.cards[currentCardIndex].front
                            }
                          </p>
                          <p className="text-xs text-muted-foreground mt-4">
                            Click to flip card
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handlePrevCard}
                    disabled={currentCardIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      onClick={handleNotKnown}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" /> Don't Know
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                      onClick={handleKnown}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" /> Know
                    </Button>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleNextCard}
                    disabled={currentCardIndex === deck.cards.length - 1}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Card {currentCardIndex + 1} of {deck.cards.length}</span>
                    <span>
                      Known: {knownCards.length} | Not Known: {notKnownCards.length}
                    </span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-1" />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No flashcards in this deck yet.</p>
                {canCreate && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={onCreateDeck}
                  >
                    Add Cards
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FlashcardStudyComponent;
