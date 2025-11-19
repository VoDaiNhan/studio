'use client';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, FileText, Calendar, CheckCircle } from 'lucide-react';
import knowledgeSources from '@/data/knowledge-sources.json';
import { ChatSidebar } from '@/components/chat-sidebar';

export default function LookupPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSources = useMemo(() => {
    if (!searchQuery.trim()) return knowledgeSources;
    
    const query = searchQuery.toLowerCase();
    return knowledgeSources.filter(source => 
      source.title.toLowerCase().includes(query) ||
      (source.content && source.content.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <ChatSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-6xl">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Tra cứu điều khoản</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Tìm kiếm nhanh các điều khoản và nghị định về giao thông đường bộ
              </p>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên luật, nghị định, hoặc nội dung..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-sm md:text-base"
              />
            </div>

            <div className="space-y-4">
              {filteredSources.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Không tìm thấy kết quả phù hợp</p>
                  </CardContent>
                </Card>
              ) : (
                filteredSources.map((source) => (
                  <Card key={source.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            {source.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Hiệu lực: {new Date(source.effectiveDate).toLocaleDateString('vi-VN')}
                            </span>
                            {source.status === 'active' && (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                Đang có hiệu lực
                              </span>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    {source.content && (
                      <CardContent>
                        <div className="bg-muted/50 p-4 rounded-md max-h-48 overflow-y-auto">
                          <pre className="text-sm whitespace-pre-wrap font-sans">
                            {source.content.substring(0, 500)}
                            {source.content.length > 500 && '...'}
                          </pre>
                        </div>
                      </CardContent>
                    )}
                    {source.url && (
                      <CardContent className="pt-0">
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          Xem toàn bộ văn bản →
                        </a>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
