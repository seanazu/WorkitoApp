import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from '@firebase/auth';
import { useNavigation } from '@react-navigation/core';
import { getDatabase, ref, set } from 'firebase/database';


export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigation()
  const auth = getAuth()

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        navigation.navigate("Home");
      }
    })
  }, [])

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth,email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        const database = getDatabase();
        set(ref(database, 'users/' + user.uid), {
          name:user.email
        });
      })
      .catch(error => alert(error.message))
  }

  const handleLogin = () => {
    signInWithEmailAndPassword(auth,email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
      })
      .catch(error => alert(error.message))
  }


  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <LinearGradient
        colors={['#333', '#222', '#111']}
        style={styles.container}
      >
        <Text style={styles.workitoImage}>
          <Image
            style={styles.tinyLogo}
            source={require('../images/Workito.jpg')}
          />
        </Text>
        <Text style={styles.loginText}>Login</Text>
        <View style={styles.inputContainer}>
           <TextInput
          placeholder='Email Address'
          placeholderTextColor='#808e9b'
          style={styles.input}
          autoCorrect={true}
          autoCapitalize={false}
          autoCompleteType='email'
          keyboardType='email-address'
          textContentType='emailAddress'
          onChangeText={text => setEmail(text)}
          />
          <TextInput
          placeholder='Password'
          placeholderTextColor='#808e9b'
          style={styles.input}
          secureTextEntry={true}
          textContentType='password'
          onChangeText={text => setPassword(text)}
          />
        </View>
       
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignUp}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems:'center'
  },
  tinyLogo: {
    width: 90,
    height: 90,
    borderRadius:20
  },
  workitoImage: {
    alignSelf: 'center',
  },
  loginTextContainer:{
    width:'120%',
    marginTop:-2
  },
  loginText: {
    color: '#fff',
    height: 40,
    fontSize: 35,
    fontWeight: 'bold',
    margin: 10,
    textAlign:'center'
  },
  inputContainer:{
    width:'100%',
    alignItems:'center',
    marginTop:30
  },
  input: {
    width: '85%',
    height: 50,
    backgroundColor: '#444',
    borderRadius: 6,
    marginTop: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#808e9b',
    textAlign:'left'
  },
  buttonContainer: {
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#444',
    width: '67%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#444',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#444',
    fontWeight: '700',
    fontSize: 16,
  },
});