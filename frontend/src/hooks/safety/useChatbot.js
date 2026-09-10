import { useState, useCallback, useRef } from 'react';
import { CHATBOT_RULES, DEFAULT_RESPONSE } from '../../constants/safety/chatbotRules';

/**
 * Finds the best matching rule for a given user message.
 * 
 * Algorithm:
 * 1. Lowercase the message and split into words
 * 2. For each rule, count how many of its keywords appear in the message
 * 3. Return the rule with the most keyword hits
 * 4. On tie, prefer the rule with higher priority
 * 5. If no rule matches (0 hits), return null
 */
function findBestMatch(message) {
  const lowerMessage = message.toLowerCase();
  let bestRule = null;
  let bestScore = 0;

  for (const rule of CHATBOT_RULES) {
    let score = 0;
    for (const keyword of rule.keywords) {
      if (lowerMessage.includes(keyword)) {
        score++;
      }
    }

    if (score > 0 && (score > bestScore || (score === bestScore && (!bestRule || rule.priority > bestRule.priority)))) {
      bestScore = score;
      bestRule = rule;
    }
  }

  return bestRule;
}

/**
 * Custom hook for managing the rule-based chatbot.
 *
 * Features:
 * - Keyword matching against 12 safety categories
 * - Simulated typing delay for natural feel
 * - Message history management
 * - Quick suggestion support
 * 
 * @returns {object} Chat state and handlers
 */
export function useChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'bot',
      text: "Hi! 👋 I'm SafeBot, your Sri Lanka travel safety assistant. Ask me about emergency services, safety tips, local customs, or anything you need help with!",
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);

  const sendMessage = useCallback((userText) => {
    if (!userText.trim() || processingRef.current) return;

    const trimmed = userText.trim();

    // Add the user's message immediately
    const userMsg = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);
    processingRef.current = true;

    // Simulate brief "thinking" delay (400-800ms) for natural feel
    const delay = 400 + Math.random() * 400;

    setTimeout(() => {
      const matchedRule = findBestMatch(trimmed);

      const botMsg = {
        id: `bot_${Date.now()}`,
        role: 'bot',
        text: matchedRule ? matchedRule.response : DEFAULT_RESPONSE,
        timestamp: new Date(),
        ruleId: matchedRule?.id || null,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsProcessing(false);
      processingRef.current = false;
    }, delay);
  }, []);

  const clearChat = useCallback(() => {
    processingRef.current = false;
    setIsProcessing(false);
    setMessages([
      {
        id: 'welcome_reset',
        role: 'bot',
        text: "Chat cleared! 👋 How can I help you? Ask me about emergency numbers, safety tips, or tap a quick button below.",
        timestamp: new Date(),
      },
    ]);
  }, []);

  return {
    messages,
    isProcessing,
    sendMessage,
    clearChat,
  };
}
