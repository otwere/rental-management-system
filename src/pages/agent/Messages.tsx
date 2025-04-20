import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Search, 
  User, 
  Mail, 
  Clock, 
  Send, 
  ChevronRight, 
  ChevronLeft,
  Plus,
  Phone,
  MoreHorizontal,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Message types
enum MessageType {
  Incoming = "incoming",
  Outgoing = "outgoing"
}

// Define contact interface
interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: "tenant" | "owner" | "vendor" | "other";
  propertyUnit?: string;
}

// Define message interface
interface Message {
  id: string;
  contactId: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

// Mock contacts
const MOCK_CONTACTS: Contact[] = [
  {
    id: "contact-1",
    name: "Simba Smith",
    email: "Simba@example.com",
    phone: "555-123-4567",
    type: "tenant",
    propertyUnit: "Sunset Apartments - Unit 101"
  },
  {
    id: "contact-2",
    name: "Emma Simbason",
    email: "emma@example.com",
    phone: "555-987-6543",
    type: "tenant",
    propertyUnit: "Urban Lofts - Unit B2"
  },
  {
    id: "contact-3",
    name: "Robert Davis",
    email: "robert@example.com",
    phone: "555-234-5678",
    type: "tenant",
    propertyUnit: "Maple Grove Townhomes - Unit T1"
  },
  {
    id: "contact-4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "555-876-5432",
    type: "owner",
  },
  {
    id: "contact-5",
    name: "Mike Plumber",
    email: "mike@plumbingpros.com",
    phone: "555-543-2109",
    type: "vendor",
  }
];

// Mock messages
const MOCK_MESSAGES: Record<string, Message[]> = {
  "contact-1": [
    {
      id: "msg-1",
      contactId: "contact-1",
      type: MessageType.Incoming,
      content: "Hi, I'm having issues with the kitchen faucet. It's been leaking for two days now.",
      timestamp: new Date("2024-04-15T10:30:00"),
      isRead: true
    },
    {
      id: "msg-2",
      contactId: "contact-1",
      type: MessageType.Outgoing,
      content: "Thank you for letting us know, Simba. I'll send a maintenance request right away. Someone will contact you soon to schedule a repair.",
      timestamp: new Date("2024-04-15T11:05:00"),
      isRead: true
    },
    {
      id: "msg-3",
      contactId: "contact-1",
      type: MessageType.Incoming,
      content: "Great, thank you. When can I expect someone to come by?",
      timestamp: new Date("2024-04-15T11:30:00"),
      isRead: true
    },
    {
      id: "msg-4",
      contactId: "contact-1",
      type: MessageType.Outgoing,
      content: "The maintenance team will call you today to schedule. It should be fixed within 24-48 hours.",
      timestamp: new Date("2024-04-15T11:45:00"),
      isRead: true
    },
    {
      id: "msg-5",
      contactId: "contact-1",
      type: MessageType.Incoming,
      content: "Perfect, I'll be home all day tomorrow if that works.",
      timestamp: new Date("2024-04-15T12:00:00"),
      isRead: false
    }
  ],
  "contact-2": [
    {
      id: "msg-6",
      contactId: "contact-2",
      type: MessageType.Outgoing,
      content: "Hello Emma, this is a reminder that your rent payment is due on the 1st of next month.",
      timestamp: new Date("2024-04-14T09:00:00"),
      isRead: true
    },
    {
      id: "msg-7",
      contactId: "contact-2",
      type: MessageType.Incoming,
      content: "Thanks for the reminder. I've already set up the automatic payment.",
      timestamp: new Date("2024-04-14T10:15:00"),
      isRead: true
    },
    {
      id: "msg-8",
      contactId: "contact-2",
      type: MessageType.Outgoing,
      content: "Great! Let me know if you need anything else.",
      timestamp: new Date("2024-04-14T10:30:00"),
      isRead: true
    }
  ],
  "contact-3": [
    {
      id: "msg-9",
      contactId: "contact-3",
      type: MessageType.Incoming,
      content: "The hallway light fixture has been fixed. Thank you for the prompt service!",
      timestamp: new Date("2024-04-12T15:45:00"),
      isRead: true
    },
    {
      id: "msg-10",
      contactId: "contact-3",
      type: MessageType.Outgoing,
      content: "You're welcome, Robert. We're glad the issue was resolved quickly. Please let us know if you notice any other issues.",
      timestamp: new Date("2024-04-12T16:00:00"),
      isRead: true
    }
  ]
};

export default function AgentMessages() {
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContactId, setSelectedContactId] = useState<string | null>("contact-1");
  const [showContactInfoModal, setShowContactInfoModal] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [newContactData, setNewContactData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "tenant" as "tenant" | "owner" | "vendor" | "other",
    propertyUnit: ""
  });
  const { toast } = useToast();

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.phone && contact.phone.includes(searchTerm)) ||
    (contact.propertyUnit && contact.propertyUnit.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get selected contact
  const selectedContact = selectedContactId ? contacts.find(c => c.id === selectedContactId) : null;
  
  // Get messages for selected contact
  const contactMessages = selectedContactId ? (messages[selectedContactId] || []) : [];

  // Count unread messages
  const getUnreadCount = (contactId: string) => {
    return (messages[contactId] || []).filter(msg => 
      msg.type === MessageType.Incoming && !msg.isRead
    ).length;
  };

  // Count total unread messages
  const totalUnreadMessages = Object.keys(messages).reduce(
    (total, contactId) => total + getUnreadCount(contactId), 0
  );

  // Sort contacts with unread messages first
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const aUnread = getUnreadCount(a.id);
    const bUnread = getUnreadCount(b.id);
    
    if (aUnread > 0 && bUnread === 0) return -1;
    if (aUnread === 0 && bUnread > 0) return 1;
    
    // Sort by most recent message if both have unread or both don't have unread
    const aMessages = messages[a.id] || [];
    const bMessages = messages[b.id] || [];
    
    const aLatest = aMessages.length > 0 ? aMessages[aMessages.length - 1].timestamp : new Date(0);
    const bLatest = bMessages.length > 0 ? bMessages[bMessages.length - 1].timestamp : new Date(0);
    
    return bLatest.getTime() - aLatest.getTime();
  });

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!selectedContactId || !newMessage.trim()) return;
    
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      contactId: selectedContactId,
      type: MessageType.Outgoing,
      content: newMessage.trim(),
      timestamp: new Date(),
      isRead: true
    };
    
    setMessages({
      ...messages,
      [selectedContactId]: [...(messages[selectedContactId] || []), newMsg]
    });
    
    setNewMessage("");
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully."
    });
  };

  // Handle creating a new contact
  const handleCreateContact = () => {
    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name: newContactData.name,
      email: newContactData.email,
      phone: newContactData.phone || undefined,
      type: newContactData.type,
      propertyUnit: newContactData.propertyUnit || undefined
    };
    
    setContacts([...contacts, newContact]);
    setMessages({
      ...messages,
      [newContact.id]: []
    });
    
    setShowNewMessageModal(false);
    setSelectedContactId(newContact.id);
    
    setNewContactData({
      name: "",
      email: "",
      phone: "",
      type: "tenant",
      propertyUnit: ""
    });
    
    toast({
      title: "Contact created",
      description: `${newContact.name} has been added to your contacts.`
    });
  };

  // Mark messages as read when selecting a contact
  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);
    
    // Mark all incoming messages from this contact as read
    const contactMsgs = messages[contactId] || [];
    const updatedMsgs = contactMsgs.map(msg => 
      msg.type === MessageType.Incoming && !msg.isRead 
        ? { ...msg, isRead: true } 
        : msg
    );
    
    if (updatedMsgs.some(msg => !msg.isRead)) {
      setMessages({
        ...messages,
        [contactId]: updatedMsgs
      });
    }
  };

  return (
    <DashboardLayout requiredPermission="view:messages">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Messages</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setShowNewMessageModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Contact
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contacts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unread Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUnreadMessages}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tenant Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contacts.filter(c => c.type === "tenant").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {sortedContacts.length > 0 ? (
                  <div className="divide-y">
                    {sortedContacts.map((contact) => (
                      <div 
                        key={contact.id} 
                        className={`p-4 hover:bg-accent/5 transition-colors cursor-pointer ${
                          selectedContactId === contact.id ? 'bg-accent/10' : ''
                        }`}
                        onClick={() => handleSelectContact(contact.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              contact.type === "tenant" 
                                ? "bg-blue-100 text-blue-800" 
                                : contact.type === "owner"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                              {contact.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{contact.name}</div>
                              <div className="text-xs text-muted-foreground flex items-center">
                                {contact.type === "tenant" ? (
                                  <>
                                    <User className="h-3 w-3 mr-1" />
                                    <span>Tenant{contact.propertyUnit ? ` - ${contact.propertyUnit}` : ''}</span>
                                  </>
                                ) : contact.type === "owner" ? (
                                  <>
                                    <User className="h-3 w-3 mr-1" />
                                    <span>Owner</span>
                                  </>
                                ) : (
                                  <>
                                    <User className="h-3 w-3 mr-1" />
                                    <span>Vendor</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          {getUnreadCount(contact.id) > 0 && (
                            <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                              {getUnreadCount(contact.id)}
                            </span>
                          )}
                        </div>
                        {messages[contact.id] && messages[contact.id].length > 0 && (
                          <div className="mt-2 text-sm text-muted-foreground flex justify-between items-center">
                            <span className="truncate max-w-[180px]">
                              {messages[contact.id][messages[contact.id].length - 1].content}
                            </span>
                            <span className="text-xs">
                              {new Date(messages[contact.id][messages[contact.id].length - 1].timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No contacts found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      No contacts match your search criteria.
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              {selectedContact ? (
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    selectedContact.type === "tenant" 
                      ? "bg-blue-100 text-blue-800" 
                      : selectedContact.type === "owner"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {selectedContact.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle>{selectedContact.name}</CardTitle>
                    <div className="text-xs text-muted-foreground">
                      {selectedContact.type.charAt(0).toUpperCase() + selectedContact.type.slice(1)}
                      {selectedContact.propertyUnit && ` - ${selectedContact.propertyUnit}`}
                    </div>
                  </div>
                </div>
              ) : (
                <CardTitle>Select a Contact</CardTitle>
              )}
              
              {selectedContact && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowContactInfoModal(true)}>
                      <User className="h-4 w-4 mr-2" />
                      Contact Info
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {selectedContact ? (
                <div className="flex flex-col h-[600px]">
                  <ScrollArea className="flex-1 p-4">
                    {contactMessages.length > 0 ? (
                      <div className="space-y-4">
                        {contactMessages.map((message) => (
                          <div 
                            key={message.id} 
                            className={`flex ${message.type === MessageType.Outgoing ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] rounded-lg p-3 ${
                              message.type === MessageType.Outgoing 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-accent'
                            }`}>
                              <div className="text-sm">{message.content}</div>
                              <div className={`text-xs mt-1 flex items-center ${
                                message.type === MessageType.Outgoing 
                                  ? 'text-primary-foreground/70 justify-end' 
                                  : 'text-muted-foreground'
                              }`}>
                                <Clock className="h-3 w-3 mr-1" />
                                <span>
                                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">No messages yet</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Start the conversation by sending a message.
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                  
                  <div className="p-4 border-t">
                    <div className="flex items-center gap-2">
                      <Textarea 
                        placeholder="Type your message..." 
                        className="min-h-[60px] resize-none"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button 
                        className="h-[60px]" 
                        disabled={!newMessage.trim()}
                        onClick={handleSendMessage}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No conversation selected</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Select a contact from the list to start messaging.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Contact Info Modal */}
      <Dialog open={showContactInfoModal} onOpenChange={setShowContactInfoModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Information</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4 py-2">
              <div className="flex justify-center">
                <div className={`h-20 w-20 rounded-full flex items-center justify-center text-2xl ${
                  selectedContact.type === "tenant" 
                    ? "bg-blue-100 text-blue-800" 
                    : selectedContact.type === "owner"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-green-100 text-green-800"
                }`}>
                  {selectedContact.name.charAt(0)}
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-semibold">{selectedContact.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedContact.type.charAt(0).toUpperCase() + selectedContact.type.slice(1)}
                </p>
              </div>
              
              <div className="space-y-3 border-t pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`mailto:${selectedContact.email}`} className="text-primary">
                      {selectedContact.email}
                    </a>
                  </div>
                </div>
                
                {selectedContact.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`tel:${selectedContact.phone}`} className="text-primary">
                        {selectedContact.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {selectedContact.propertyUnit && (
                  <div>
                    <p className="text-sm text-muted-foreground">Property Unit</p>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{selectedContact.propertyUnit}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center gap-4 pt-2">
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                {selectedContact.phone && (
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* New Contact Modal */}
      <Dialog open={showNewMessageModal} onOpenChange={setShowNewMessageModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input 
                placeholder="Contact name" 
                value={newContactData.name}
                onChange={(e) => setNewContactData({...newContactData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Input 
                placeholder="Email address" 
                type="email"
                value={newContactData.email}
                onChange={(e) => setNewContactData({...newContactData, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Input 
                placeholder="Phone number (optional)" 
                value={newContactData.phone}
                onChange={(e) => setNewContactData({...newContactData, phone: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Select 
                value={newContactData.type}
                onValueChange={(value: "tenant" | "owner" | "vendor" | "other") => 
                  setNewContactData({...newContactData, type: value})
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Contact type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tenant">Tenant</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newContactData.type === "tenant" && (
              <div className="space-y-2">
                <Input 
                  placeholder="Property/Unit (e.g., Sunset Apartments - Unit 101)" 
                  value={newContactData.propertyUnit}
                  onChange={(e) => setNewContactData({...newContactData, propertyUnit: e.target.value})}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewMessageModal(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateContact}
              disabled={!newContactData.name || !newContactData.email}
            >
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
