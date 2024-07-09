
import { navigationRef } from './NavigatationRef'; 

export function navigateToConversationScreen(params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Messaging', {
      screen: 'ConversationScreen',
      params,
    });
  } else {
    console.warn("Navigation attempt before navigation system is ready");
  }
}
