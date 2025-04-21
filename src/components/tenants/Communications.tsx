
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Mail, MailOpen, Send } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface Communication {
  id: string;
  type: "email" | "message";
  subject: string;
  content: string;
  date: string;
  status: "sent" | "read" | "unread";
}

export function Communications() {
  const [communications, setCommunications] = useState<Communication[]>([
    {
      id: "1",
      type: "email",
      subject: "Maintenance Follow-up",
      content: "Follow-up regarding the recent maintenance request",
      date: "2024-03-15",
      status: "read"
    },
    {
      id: "2",
      type: "message",
      subject: "Rent Payment Confirmation",
      content: "Confirming receipt of March 2024 rent payment",
      date: "2024-03-01",
      status: "sent"
    },
    {
      id: "3",
      type: "email",
      subject: "Annual Inspection Notice",
      content: "Scheduling annual unit inspection",
      date: "2024-02-28",
      status: "unread"
    }
  ]);

  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showViewMessageModal, setShowViewMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Communication | null>(null);
  const [newMessage, setNewMessage] = useState({
    type: "email" as "email" | "message",
    subject: "",
    content: ""
  });
  const { toast } = useToast();

  const handleSendNewMessage = () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const newCommunication: Communication = {
      id: `${communications.length + 1}`,
      type: newMessage.type,
      subject: newMessage.subject,
      content: newMessage.content,
      date: currentDate,
      status: "sent"
    };
    
    setCommunications([newCommunication, ...communications]);
    setShowNewMessageModal(false);
    setNewMessage({
      type: "email",
      subject: "",
      content: ""
    });
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully.",
    });
  };

  const handleOpenMessage = (comm: Communication) => {
    setSelectedMessage(comm);
    setShowViewMessageModal(true);
    
    // Mark as read if it was unread
    if (comm.status === "unread") {
      setCommunications(communications.map(c => 
        c.id === comm.id ? { ...c, status: "read" } : c
      ));
    }
  };

  const handleCloseViewMessage = () => {
    setShowViewMessageModal(false);
    setSelectedMessage(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Communication History</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowNewMessageModal(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {communications.map((comm) => (
                <div 
                  key={comm.id} 
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
                  onClick={() => handleOpenMessage(comm)}
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {comm.type === "email" ? 
                      (comm.status === "unread" ? 
                        <Mail className="h-4 w-4 text-primary" /> : 
                        <MailOpen className="h-4 w-4 text-primary" />) : 
                      <MessageSquare className="h-4 w-4 text-primary" />
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{comm.subject}</p>
                        <p className="text-sm text-muted-foreground">{comm.content}</p>
                      </div>
                      {comm.status === "unread" && (
                        <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{comm.date}</p>
                  </div>
                </div>
              ))}
              
              {communications.length === 0 && (
                <div className="text-center p-6 text-muted-foreground">
                  No communications found
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* New Message Modal */}
      <Dialog open={showNewMessageModal} onOpenChange={setShowNewMessageModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Select 
                value={newMessage.type} 
                onValueChange={(value: "email" | "message") => setNewMessage({...newMessage, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select message type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="message">Text Message</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Input 
                placeholder="Subject" 
                value={newMessage.subject}
                onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Textarea 
                placeholder="Message content" 
                className="min-h-[150px]"
                value={newMessage.content}
                onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewMessageModal(false)}>Cancel</Button>
            <Button onClick={handleSendNewMessage} disabled={!newMessage.subject || !newMessage.content}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Message Modal */}
      <Dialog open={showViewMessageModal} onOpenChange={handleCloseViewMessage}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedMessage?.type === "email" ? "Email" : "Text Message"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="pb-2 border-b">
              <h3 className="font-semibold text-lg">{selectedMessage?.subject}</h3>
              <p className="text-sm text-muted-foreground">{selectedMessage?.date}</p>
            </div>
            <div className="min-h-[100px]">
              <p>{selectedMessage?.content}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseViewMessage}>Close</Button>
            <Button onClick={() => {
              setShowViewMessageModal(false);
              setNewMessage({
                type: selectedMessage?.type || "email",
                subject: `Re: ${selectedMessage?.subject || ""}`,
                content: ""
              });
              setShowNewMessageModal(true);
            }}>
              Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
