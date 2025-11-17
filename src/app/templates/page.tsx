'use client';

import { useState } from 'react';
import { ChatSidebar } from '@/components/chat-sidebar';
import { ChatHeader } from '@/components/chat-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FileText, Download, Search } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
}

const templates: Template[] = [
  {
    id: '1',
    title: 'Đơn khiếu nại hành chính',
    category: 'Hành chính',
    description: 'Mẫu đơn khiếu nại quyết định hành chính của cơ quan nhà nước',
    content: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------

ĐơN KHIẾU NẠI

Kính gửi: [Tên cơ quan nhận đơn]

Tôi tên là: [Họ và tên]
Sinh ngày: [Ngày/tháng/năm sinh]
Địa chỉ thường trú: [Địa chỉ]
Số CMND/CCCD: [Số] cấp ngày [Ngày cấp] tại [Nơi cấp]

Tôi viết đơn này để khiếu nại về: [Nội dung khiếu nại]

Lý do khiếu nại: [Trình bày chi tiết lý do]

Yêu cầu giải quyết: [Nêu rõ yêu cầu]

Tôi xin cam đoan những nội dung trên là đúng sự thật và xin chịu trách nhiệm trước pháp luật về đơn khiếu nại này.

                                    [Địa phương], ngày ... tháng ... năm ...
                                    Người khiếu nại
                                    (Ký và ghi rõ họ tên)`
  },
  {
    id: '2',
    title: 'Hợp đồng mua bán',
    category: 'Dân sự',
    description: 'Mẫu hợp đồng mua bán tài sản cơ bản',
    content: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------

HỢP ĐỒNG MUA BÁN

Hôm nay, ngày ... tháng ... năm ...
Tại: [Địa điểm ký hợp đồng]

Chúng tôi gồm:

BÊN BÁN (Bên A):
Ông/Bà: [Họ và tên]
Sinh ngày: [Ngày sinh]
CMND/CCCD số: [Số] cấp ngày [Ngày cấp] tại [Nơi cấp]
Địa chỉ thường trú: [Địa chỉ]

BÊN MUA (Bên B):
Ông/Bà: [Họ và tên]
Sinh ngày: [Ngày sinh]
CMND/CCCD số: [Số] cấp ngày [Ngày cấp] tại [Nơi cấp]
Địa chỉ thường trú: [Địa chỉ]

Hai bên thỏa thuận ký kết hợp đồng với các điều khoản sau:

ĐIỀU 1: ĐỐI TƯỢNG MUA BÁN
[Mô tả tài sản]

ĐIỀU 2: GIÁ TRỊ VÀ PHƯƠNG THỨC THANH TOÁN
- Tổng giá trị: [Số tiền] VNĐ
- Phương thức thanh toán: [Chi tiết]

ĐIỀU 3: QUYỀN VÀ NGHĨA VỤ CỦA CÁC BÊN
[Chi tiết quyền và nghĩa vụ]

ĐIỀU 4: ĐIỀU KHOẢN CHUNG
Hợp đồng có hiệu lực kể từ ngày ký.

        BÊN BÁN                    BÊN MUA
    (Ký và ghi rõ họ tên)      (Ký và ghi rõ họ tên)`
  },
  {
    id: '3',
    title: 'Đơn xin việc',
    category: 'Lao động',
    description: 'Mẫu đơn xin việc chuẩn',
    content: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------

ĐƠN XIN VIỆC

Kính gửi: [Tên công ty/đơn vị]

Tôi tên là: [Họ và tên]
Sinh ngày: [Ngày/tháng/năm sinh]
Địa chỉ: [Địa chỉ]
Điện thoại: [Số điện thoại]
Email: [Email]

Tôi được biết Quý công ty đang có nhu cầu tuyển dụng vị trí [Tên vị trí]. Với trình độ chuyên môn và kinh nghiệm của mình, tôi tin rằng tôi có thể đáp ứng tốt yêu cầu công việc.

Trình độ học vấn: [Trình độ]
Kinh nghiệm làm việc: [Mô tả ngắn gọn]

Tôi mong muốn được làm việc tại Quý công ty và đóng góp vào sự phát triển chung.

Tôi xin trân trọng cảm ơn!

                                    [Địa phương], ngày ... tháng ... năm ...
                                    Người làm đơn
                                    (Ký và ghi rõ họ tên)`
  },
  {
    id: '4',
    title: 'Hợp đồng thuê nhà',
    category: 'Dân sự',
    description: 'Mẫu hợp đồng thuê nhà ở',
    content: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------

HỢP ĐỒNG THUÊ NHÀ

Hôm nay, ngày ... tháng ... năm ...

BÊN CHO THUÊ (Bên A):
Ông/Bà: [Họ và tên]
CMND/CCCD: [Số]
Địa chỉ: [Địa chỉ]

BÊN THUÊ (Bên B):
Ông/Bà: [Họ và tên]
CMND/CCCD: [Số]
Địa chỉ: [Địa chỉ]

ĐIỀU 1: ĐỐI TƯỢNG CHO THUÊ
Bên A đồng ý cho Bên B thuê nhà tại địa chỉ: [Địa chỉ nhà cho thuê]

ĐIỀU 2: THỜI HẠN THUÊ
Thời hạn thuê: [Số] tháng, từ ngày ... đến ngày ...

ĐIỀU 3: GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN
- Giá thuê: [Số tiền] VNĐ/tháng
- Thanh toán: [Hình thức thanh toán]
- Tiền đặt cọc: [Số tiền] VNĐ

ĐIỀU 4: QUYỀN VÀ NGHĨA VỤ
[Chi tiết quyền và nghĩa vụ của các bên]

        BÊN CHO THUÊ              BÊN THUÊ
    (Ký và ghi rõ họ tên)    (Ký và ghi rõ họ tên)`
  },
  {
    id: '5',
    title: 'Đơn xin nghỉ phép',
    category: 'Lao động',
    description: 'Mẫu đơn xin nghỉ phép',
    content: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------

ĐƠN XIN NGHỈ PHÉP

Kính gửi: [Ban Giám đốc/Phòng Nhân sự]

Tôi tên là: [Họ và tên]
Chức vụ: [Chức vụ]
Bộ phận: [Tên bộ phận]

Tôi làm đơn này kính xin được nghỉ phép từ ngày ... đến ngày ... (tổng cộng ... ngày).

Lý do: [Nêu rõ lý do nghỉ phép]

Trong thời gian nghỉ, tôi đã bàn giao công việc cho [Họ tên người thay thế] và cam kết hoàn thành công việc còn dang dở khi trở lại làm việc.

Kính mong Ban Giám đốc xem xét và chấp thuận.
Tôi xin chân thành cảm ơn!

                                    [Địa phương], ngày ... tháng ... năm ...
                                    Người làm đơn
                                    (Ký và ghi rõ họ tên)`
  },
  {
    id: '6',
    title: 'Giấy ủy quyền',
    category: 'Dân sự',
    description: 'Mẫu giấy ủy quyền cơ bản',
    content: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------

GIẤY ủY QUYỀN

Hôm nay, ngày ... tháng ... năm ...

BÊN ỦY QUYỀN:
Ông/Bà: [Họ và tên]
Sinh ngày: [Ngày sinh]
CMND/CCCD: [Số] cấp ngày [Ngày cấp] tại [Nơi cấp]
Địa chỉ: [Địa chỉ]

BÊN NHẬN ỦY QUYỀN:
Ông/Bà: [Họ và tên]
Sinh ngày: [Ngày sinh]
CMND/CCCD: [Số] cấp ngày [Ngày cấp] tại [Nơi cấp]
Địa chỉ: [Địa chỉ]

NỘI DUNG ỦY QUYỀN:
Bên ủy quyền ủy quyền cho Bên nhận ủy quyền thực hiện các công việc sau:
[Nêu rõ nội dung ủy quyền]

Giấy ủy quyền này có hiệu lực từ ngày ký đến ngày ...

Bên ủy quyền xin cam đoan chịu trách nhiệm về những gì Bên nhận ủy quyền thực hiện theo đúng nội dung ủy quyền.

    BÊN ỦY QUYỀN              BÊN NHẬN ỦY QUYỀN
  (Ký và ghi rõ họ tên)      (Ký và ghi rõ họ tên)`
  }
];

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const categories = ['Tất cả', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = async (template: Template) => {
    try {
      const { Document, Paragraph, TextRun, AlignmentType, HeadingLevel } = await import('docx');
      const { saveAs } = await import('file-saver');

      // Split content into lines
      const lines = template.content.split('\n');
      
      // Create paragraphs from content
      const paragraphs = lines.map(line => {
        const trimmedLine = line.trim();
        
        // Check if it's a heading
        if (trimmedLine.includes('CỘNG HÒA') || trimmedLine.includes('ĐƠN') || trimmedLine.includes('HỢP ĐỒNG') || trimmedLine.includes('GIẤY')) {
          return new Paragraph({
            text: trimmedLine,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          });
        }
        
        // Check if it's a separator
        if (trimmedLine === '---------------') {
          return new Paragraph({
            text: '_______________',
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          });
        }
        
        // Check if it's a section heading (ĐIỀU, BÊN, etc.)
        if (trimmedLine.startsWith('ĐIỀU') || trimmedLine.startsWith('BÊN') || trimmedLine.includes(':')) {
          return new Paragraph({
            children: [
              new TextRun({
                text: trimmedLine,
                bold: true
              })
            ],
            spacing: { before: 200, after: 100 }
          });
        }
        
        // Regular paragraph
        return new Paragraph({
          text: trimmedLine,
          spacing: { after: 100 }
        });
      });

      // Create document
      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs
        }]
      });

      // Generate and save
      const blob = await import('docx').then(m => m.Packer.toBlob(doc));
      saveAs(blob, `${template.title}.docx`);
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Có lỗi khi tạo file Word. Vui lòng thử lại.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar />
      
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        
        <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mẫu đơn pháp lý</h1>
            <p className="text-gray-600">Thư viện các mẫu đơn, hợp đồng pháp lý chuẩn</p>
          </div>

          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Tìm kiếm mẫu đơn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>

          {selectedTemplate ? (
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTemplate.title}</h2>
                  <p className="text-gray-600 mt-1">{selectedTemplate.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleDownload(selectedTemplate)}>
                    <Download className="h-4 w-4 mr-2" />
                    Tải xuống
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                    Đóng
                  </Button>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                  {selectedTemplate.content}
                </pre>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <Card
                  key={template.id}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{template.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {template.category}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Không tìm thấy mẫu đơn phù hợp</p>
            </div>
          )}
        </div>
      </main>
      </div>
    </div>
  );
}
