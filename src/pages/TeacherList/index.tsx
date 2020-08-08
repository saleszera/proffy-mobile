import React, { useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import {View, Text, TextInput} from 'react-native';
import {Feather} from '@expo/vector-icons';


import PageHeader from '../../components/PageHeader';
import TeacherItem, {Teacher} from '../../components/TeacherItem';
import styles from './styles';
import api from '../../services/api';

function TeacherList(){
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const [teachers, setTeachers] = useState([]);
  const [subject, setSubject] = useState('');
  const [week_day, setWeek_day] = useState('');
  const [time, setTime] = useState('');

  const [favorites, setFavorites] = useState<number[]>([]);

  function loadFavorites(){
    AsyncStorage.getItem('favorites').then(response => {
      if(response){
        const favoritedTeachers = JSON.parse(response)
        const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => teacher.id)
        setFavorites(favoritedTeachersIds);
       }
    })
  }

  function handleToggleFiltersVisible(){
    loadFavorites();
    setIsFiltersVisible(!isFiltersVisible);
  }

  async function handleFiltersSubmit(){
    const response = await api.get('classes', {
      params: {
        subject,
        week_day,
        time,
      }
    })

    setIsFiltersVisible(false);
    setTeachers(response.data);
    setSubject('');
    setWeek_day('');
    setTime('');
  }  

  return (
    <View style={styles.container}>
        <PageHeader 
          title="Proffys disponíveis"
          headerRight={(
            <BorderlessButton onPress={handleToggleFiltersVisible}>
              <Feather name="filter" size={20} color="#FFF"/>
            </BorderlessButton>
          )}
        >
          { isFiltersVisible && (
            <View style={styles.searchForm}>
              <Text style={styles.label}>Matéria</Text>

              <TextInput 
                style={styles.input}
                placeholder="Qual a matéria?"
                placeholderTextColor="#c1bccc"
                value={subject}
                onChangeText={text => setSubject(text)}
              />

              <View style={styles.inputGroup}>
                <View style={styles.inputBlock}>
                  <Text style={styles.label}>Dias da semana</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Qual o dia?"
                    placeholderTextColor="#c1bccc"
                    value={week_day}
                    onChangeText={text => setWeek_day(text)}
                  />
                </View>

                <View style={styles.inputBlock}>
                  <Text style={styles.label}>Horário</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Qual horário?"
                    placeholderTextColor="#c1bccc"
                    value={time}
                    onChangeText={text => setTime(text)}
                  />
                </View>
              </View>

              <RectButton style={styles.submitButton} onPress={handleFiltersSubmit}>
                <Text style={styles.submitButtonText}>Filtrar</Text>
              </RectButton>
            </View>
          )}
        </PageHeader>

        <ScrollView
          style={styles.teacherList}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
        >
          {teachers.map((teacher: Teacher) => (
            <TeacherItem 
              key={teacher.id} 
              teacher={teacher}
              favorited={favorites.includes(teacher.id)}
            />
          ))}
        
              
        </ScrollView>

    </View>
  )
}

export default TeacherList;