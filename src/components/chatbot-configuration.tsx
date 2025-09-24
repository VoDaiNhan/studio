import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from './ui/button';
import { Info, Paintbrush, Bot, BrainCircuit, History, GripVertical, Book, GraduationCap, FileText, MessageCircle } from 'lucide-react';

const scenarioItems = [
    { icon: Book, title: "Đăng ký học phần" },
    { icon: GraduationCap, title: "Chương trình đào tạo & Tốt nghiệp?" },
    { icon: FileText, title: "Cải thiện kết quả học tập" },
    { icon: MessageCircle, title: "Quy chế & Thủ tục sinh viên" },
];

export function ChatbotConfiguration() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Chatbot Configuration</h2>
      <p className="text-muted-foreground mb-4">
        Customize the look, behavior, and knowledge of your chatbot.
      </p>

      <Tabs defaultValue="scenario">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appearance">
            <Paintbrush className="w-4 h-4 mr-2" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="scenario">
            <Bot className="w-4 h-4 mr-2" /> Scenario
          </TabsTrigger>
          <TabsTrigger value="knowledge">
            <BrainCircuit className="w-4 h-4 mr-2" /> Knowledge
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" /> History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your chatbot.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Appearance settings will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="scenario" className="space-y-6">
          <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary"/>
                    <CardTitle className="text-lg">How it works</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create a scenario-based conversation for your chatbot. Add root
                questions, then follow-up questions to build a decision tree. If
                the user asks something not in the scenario, the AI will
                respond freely.
              </p>
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {scenarioItems.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                    <AccordionItem value={`item-${index+1}`} className="border-b-0">
                        <AccordionTrigger className="p-4 hover:no-underline">
                            <div className="flex items-center gap-4">
                                <GripVertical className="h-5 w-5 text-muted-foreground cursor-move"/>
                                <span className="font-semibold">{index + 1}.</span>
                                <item.icon className="h-5 w-5 text-muted-foreground"/>
                                <div>
                                    <p className="font-semibold text-base">{item.title}</p>
                                    <p className="text-sm text-muted-foreground font-normal">Click to expand and edit</p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 bg-muted/30">
                            Edit content for "{item.title}" here.
                        </AccordionContent>
                    </AccordionItem>
                </Card>
            ))}
          </Accordion>
        </TabsContent>
        <TabsContent value="knowledge">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge</CardTitle>
              <CardDescription>
                Manage your chatbot's knowledge base.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Knowledge base settings will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
              <CardDescription>
                View conversation history.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Conversation history will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
