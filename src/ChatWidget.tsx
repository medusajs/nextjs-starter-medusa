'use client';

import ConnectyCubeChatWidget from '@connectycube/chat-widget/react19';
import { AdminStore, StoreCustomer } from '@medusajs/types';

export interface ChatWidgetProps {
    store: AdminStore;
    customer: StoreCustomer | null;
}

export default function ChatWidget({store, customer}: ChatWidgetProps) {
    const quickActions = {
        title: 'Quick Actions',
        description: 'Select an action from the options below or type a first message to start a conversation.',
        actions: [
          'Hello there!',
          'How are you doing today?',
          'What features of the ConnectyCube SDK do you find most useful and how have they improved your development process?',
          'Goodbye and take care!',
        ],
    };

    if (!customer) {
        return null;
    }

  return (
    <div>
        <ConnectyCubeChatWidget
          appId={process.env.NEXT_PUBLIC_CHAT_APP_ID}
          authKey={process.env.NEXT_PUBLIC_CHAT_AUTH_KEY}
          userId={customer.id}
          userName={`${customer.first_name} ${customer.last_name}`}
          showOnlineUsersTab={false}
          splitView={true}
          quickActions={quickActions}
          defaultChat={{
            id: store.id,
            opponentUserId: 13301995,
            type: "1on1",
            name: store.name
          }}
        />
    </div>
  );
}