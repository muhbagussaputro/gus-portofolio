'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/app/(home)/Layout';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: 'Halo! Selamat datang di komunitas pengembang web kami.',
    sender: 'other',
    timestamp: '09:00',
  },
  {
    id: 2,
    text: 'Di sini kita bisa berbagi pengalaman dan belajar bersama.',
    sender: 'other',
    timestamp: '09:01',
  },
];

export default function KomunitasPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage('');

    // Simulasi respons dari pengguna lain
    setTimeout(() => {
      const response: Message = {
        id: messages.length + 2,
        text: 'Terima kasih atas pesannya! Saya akan segera merespons.',
        sender: 'other',
        timestamp: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Komunitas</h1>
              <p className="text-xl text-neutral-600">
                Bergabunglah dengan komunitas pengembang web kami
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Chat Header */}
              <div className="bg-[#b3cde0] p-4">
                <h2 className="text-xl font-semibold text-white">
                  Forum Diskusi
                </h2>
              </div>

              {/* Chat Messages */}
              <div className="h-[500px] overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-[#b3cde0] text-white'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === 'user'
                            ? 'text-white/70'
                            : 'text-neutral-500'
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ketik pesan Anda..."
                    className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#b3cde0] focus:border-transparent"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="btn-primary"
                  >
                    Kirim
                  </motion.button>
                </div>
              </form>
            </div>

            {/* Community Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold mb-4">Forum Diskusi</h3>
                <p className="text-neutral-600">
                  Berbagi pengalaman dan bertanya tentang pengembangan web.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold mb-4">Code Review</h3>
                <p className="text-neutral-600">
                  Dapatkan feedback untuk kode Anda dari pengembang berpengalaman.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold mb-4">Kolaborasi</h3>
                <p className="text-neutral-600">
                  Temukan mitra untuk proyek kolaborasi yang menarik.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
} 