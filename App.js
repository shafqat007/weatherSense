


import { StyleSheet,View } from 'react-native';

import FetchData from './src';



export default function App() {
  return (
    <View style={styles.container}>
     
      <FetchData/>
     
    </View>
  );

}


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'rgba(220, 255, 255, 0.9)',
 
    justifyContent: 'center',
  },

});
