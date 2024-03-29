import { View, Text , StyleSheet} from 'react-native'
import React,{useState,useEffect} from 'react'
import { db } from '../config'
import { ref, onValue} from 'firebase/database'

const FetchData = () => {
    const [ todoData, setTodoData] = useState([])

    useEffect (() => {
        const starCountRef = ref(db,'posts/');
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            const newPosts = Object.keys(data).map(key =>({
                id:key,
                ...data[key]
            }));
            console.log(newPosts);
            setTodoData(newPosts);
        } ); 
    },[])
  return (
    <View style = {styles.container}>
      <Text style = {styles.header}>WeatherApp</Text>
{
    todoData.map((item,index)=>{
        return(
            <View  key={index}>
                <Text style={styles.text}>{item.body}</Text>
                <Text style={styles.text}>{item.title}</Text>
            </View>
        )
    })
}

    </View>
  )
}

export default FetchData

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },

    header:{
        fontSize:30,
        textAlign:'center',
        marginTop:100,
        fontWeight:'bold'
    },
    text:{
        fontSize:20,
        textAlign:'center',
        marginTop:20
    }

  }); 