import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Plane, 
  MapPin, 
  Calendar, 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Globe,
  Clock,
  DollarSign,
  Star,
  Map,
  Route
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  agentType?: 'destination' | 'itinerary' | 'booking';
  timestamp: Date;
}

interface Agent {
  id: string;
  name: string;
  type: 'destination' | 'itinerary' | 'booking';
  description: string;
  icon: any;
  status: 'idle' | 'working' | 'completed';
  color: string;
}

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Travel Assistant. Let me help you plan your perfect trip. Where would you like to go?",
      sender: 'agent',
      agentType: 'destination',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentTrip, setCurrentTrip] = useState({
    destination: "",
    dates: "",
    budget: "",
    travelers: 1,
    status: "planning"
  });

  const agents: Agent[] = [
    {
      id: 'destination',
      name: 'Destination Research Agent',
      type: 'destination',
      description: 'Discovers perfect destinations based on your preferences',
      icon: Globe,
      status: 'working',
      color: 'text-sky-600'
    },
    {
      id: 'itinerary',
      name: 'Itinerary Planning Agent',
      type: 'itinerary',
      description: 'Creates detailed day-by-day travel plans',
      icon: Map,
      status: 'idle',
      color: 'text-teal-600'
    },
    {
      id: 'booking',
      name: 'Flight Booking Agent',
      type: 'booking',
      description: 'Finds and books the best flights via Skyscanner',
      icon: Plane,
      status: 'idle',
      color: 'text-emerald-600'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Great choice! I'm analyzing the best destinations for you. Let me check current flight prices and create some amazing itinerary options. This might take a moment...",
        sender: 'agent',
        agentType: selectedAgent as any || 'destination',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-teal-50 to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-travel rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
                  TripMind AI
                </h1>
                <p className="text-xs text-muted-foreground">Intelligent Travel Planning</p>
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <Button variant="ghost" size="sm">My Trips</Button>
              <Button variant="ghost" size="sm">Explore</Button>
              <Button size="sm">Sign In</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Agents */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">AI Travel Agents</h2>
              <p className="text-muted-foreground">Our specialized AI agents work together to plan your perfect trip</p>
            </div>
            
            <div className="space-y-4">
              {agents.map((agent) => {
                const IconComponent = agent.icon;
                return (
                  <Card 
                    key={agent.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedAgent === agent.id ? 'ring-2 ring-primary border-primary' : ''
                    }`}
                    onClick={() => setSelectedAgent(agent.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${
                          agent.type === 'destination' ? 'from-sky-100 to-sky-200' :
                          agent.type === 'itinerary' ? 'from-teal-100 to-teal-200' :
                          'from-emerald-100 to-emerald-200'
                        }`}>
                          <IconComponent className={`w-5 h-5 ${agent.color}`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-sm">{agent.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge 
                              variant={agent.status === 'working' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {agent.status === 'working' ? (
                                <>
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Working
                                </>
                              ) : agent.status === 'completed' ? (
                                <>
                                  <Star className="w-3 h-3 mr-1" />
                                  Completed
                                </>
                              ) : (
                                'Ready'
                              )}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">{agent.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Trip Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Route className="w-5 h-5" />
                  <span>Current Trip</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {currentTrip.destination || "Destination: Not selected"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {currentTrip.dates || "Dates: Not selected"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {currentTrip.budget || "Budget: Not set"}
                    </span>
                  </div>
                </div>
                <Button className="w-full" size="sm">
                  View Full Itinerary
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bot className="w-6 h-6 text-primary" />
                    <div>
                      <CardTitle>AI Travel Assistant</CardTitle>
                      <CardDescription>
                        Chat with our AI agents to plan your perfect trip
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Online</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <Separator />
              
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-3 max-w-[80%] ${
                          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className={
                              message.sender === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-secondary'
                            }>
                              {message.sender === 'user' ? (
                                <User className="w-4 h-4" />
                              ) : (
                                <Bot className="w-4 h-4" />
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`rounded-lg px-4 py-2 ${
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-secondary">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-muted rounded-lg px-4 py-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>
                
                <Separator />
                
                <div className="p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask me about your next trip..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    AI agents can help you research destinations, plan itineraries, and book flights
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
