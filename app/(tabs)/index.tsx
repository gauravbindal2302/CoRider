import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [tripInfo, setTripInfo] = useState({
    name: "",
    from: "",
    to: ""
  })

  const api = "https://qa.corider.in/assignment/chat?page=0"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${api}`);
        const data = res.data.chats.map((chat) => ({
          id: chat.id,
          text: chat.message.replace(/<br>/g, '\n'),
          sender: chat.sender.self ? 'me' : 'other',
          time: chat.time,
        }));
        setTripInfo({
          name: res.data.name,
          from: res.data.from,
          to: res.data.to,
        })
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch chat data', err);
      }
    };
    fetchData();
  }, []);

  const renderItem = ({ item }) => {
    const isMe = item.sender === 'me';
    const dateTime = new Date(item.time).toLocaleString();
  
    return (
      <View style={{ marginBottom: 12 }}>
         <Text style={styles.timeText}>{dateTime}</Text>
        <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.otherMessage]}>
          <Text style={[styles.messageText, isMe ? styles.myText : styles.otherText]}>
            {item.text}
          </Text>
          <Text style={styles.timeText}>{dateTime}</Text>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>

      {/* Main Header - Trip and Location Details */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.tripTitle}>{tripInfo.name}</Text>
          <Text style={styles.subText}>
            From <Text style={styles.bold}>{tripInfo.from}</Text> To <Text style={styles.bold}>{tripInfo.to}</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.menuIcon}>
          <Entypo name="dots-three-vertical" size={18} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.dateText}>12 JAN, 2024</Text>

      {/* Messages Container */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatList}
      />

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TouchableOpacity>
          <MaterialIcons name="photo-camera" size={24} color="#1F9E7E" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 12 }}>
          <Ionicons name="videocam" size={24} color="#1F9E7E" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Reply to @Rohit Yadav"
        />
        <TouchableOpacity>
          <Ionicons name="send" size={24} color="#1F9E7E" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginTop: 28,
  },
  tripTitle: { fontSize: 16, fontWeight: 'bold' },
  subText: { fontSize: 14, color: '#444' },
  bold: { fontWeight: 'bold' },
  menuIcon: { marginLeft: 'auto' },
  dateText: {
    alignSelf: 'center',
    fontSize: 12,
    color: '#888',
    marginVertical: 8,
  },
  chatList: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 12,
    marginVertical: 6,
    maxWidth: '85%',
  },
  myMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#F1F1F1',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
  },
  myText: {
    color: '#fff',
  },
  otherText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    marginHorizontal: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  timeText: {
    fontSize: 11,
    color: '#999',
    alignSelf: 'center',
    marginBottom: 4,
  },
});