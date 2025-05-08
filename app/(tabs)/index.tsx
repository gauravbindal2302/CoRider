import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
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

  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => {
    setShowMenu(prevState => !prevState);
  };

  const api = "https://qa.corider.in/assignment/chat?page=0"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${api}`);
        const data = res.data.chats.map((chat) => ({
          id: chat.id,
          message: chat.message.replace(/<br>/g, '\n'),
          sender: chat.sender.self ? 'me' : 'other',
          image: chat.sender.image,
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
      <View>
        <Text style={styles.timeText}>{dateTime}</Text>
        <View style={[styles.row, isMe ? styles.rightAlign : styles.leftAlign]}>
          {!isMe && (
            <Image
              source={{ uri: item.image }}
              style={styles.profileImage}
            />
          )}
          <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.otherMessage]}>
            <Text style={[styles.messageText, isMe ? styles.myText : styles.otherText]}>
              {item.message}
            </Text>
          </View>
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
        <TouchableOpacity style={styles.menuIcon} onPress={toggleMenu}>
          <Entypo name="dots-three-vertical" size={18} color="black" />
        </TouchableOpacity>
      </View>

      {showMenu && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person-outline" size={20} color="black" style={styles.menuIconLeft} />
            <Text style={styles.menuText}>Members</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="call-outline" size={20} color="black" style={styles.menuIconLeft} />
            <Text style={styles.menuText}>Share Number</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="black" style={styles.menuIconLeft} />
            <Text style={styles.menuText}>Report</Text>
          </TouchableOpacity>
        </View>
      )}

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
  menu: {
    position: 'absolute',
    top: 85,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 6,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#eee',
  },
  menuIconLeft: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 15,
    color: '#111',
  },
  dateText: {
    alignSelf: 'center',
    fontSize: 12,
    color: '#888',
    marginVertical: 8,
  },
  chatList: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 12,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 12,
    marginVertical: 6,
    maxWidth: '75%',
  },
  myMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#F1F1F1',
    alignSelf: 'flex-start',
    display: 'flex',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profileImage: {
    width: 24,
    height: 24,
    borderRadius: 18,
    marginRight: 8,
    marginVertical: 6,
  },
  leftAlign: {
    alignSelf: 'flex-start',
  },
  rightAlign: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
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