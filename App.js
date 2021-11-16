import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert} from 'react-native';
import {theme} from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';

const STORAGE_KEY = '@toDos';

export default function App() {

  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState({});

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const addToDo = async () => {
    if (text === '') {
      return;
    }
    const newToDos = {...toDos, [Date.now()]: {text, working}};
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText('');
  };
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  };
  const deleteToDos = async (key) => {
    Alert.alert('Delete To Do', 'Are you sure?', [
      {text: 'Cancel'},
      {
        text: 'Ok', onPress: () => {
          const newToDos = {...toDos};
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        }
      }
    ]);
    return;

  };

  useEffect(() => {
    loadToDos();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? 'white' : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: !working ? 'white' : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        returnKeyType="done"
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        value={text}
        placeholder={working ? 'Add a To Do' : 'Where do you want to go?'}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) => (
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteToDos(key)}>
                <Fontisto name="trash" size={18} color={theme.toDoBg} />
              </TouchableOpacity>
            </View>
          ) : null
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100
  },
  btnText: {
    fontSize: 38,
    fontWeight: '600'
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  toDoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500'
  }
});
