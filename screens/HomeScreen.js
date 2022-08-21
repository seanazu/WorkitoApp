import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@rneui/themed';
import { getDatabase, ref, set, onValue} from 'firebase/database';

const HomeScreen = () => {
  const[addDisplay, setAddDisplay] = useState('none');
  const[workers, setWorkers] = useState([]);
  const[newWorker, setNewWorker] = useState({});
  const[workerClicked, setWorkerClicked] = useState({});
  const[workerName, setWorkerName] = useState('')
  const[workerCardDisplay, setWorkerCardDisplay] = useState('none');
  const[workerRecoveryData, setWorkerRecoverData] = useState({});
  const[editRecoveryDataDisplay, setEditRecoveryDataDisplay] = useState('none')


  const navigation = useNavigation(); 
  const auth = getAuth();
  const db = getDatabase();

  useEffect(()=>{
    const reference = ref(db, 'users/' + auth.currentUser?.uid);
    onValue(reference,(snapshot) =>{
      if(snapshot.val() != null){
        const workers = snapshot.val().workers
        setWorkers(workers)
      }
    })
    
  },[])

  const addWorker = () => {
    let newWorkersArray = []; 
    if(workers){
      newWorkersArray =  [...workers,newWorker]
    } else if(!workers){
      newWorkersArray = [newWorker]
    }
      set(ref(db, "/users/"+auth.currentUser?.uid,{merge:true}), {
        workers:newWorkersArray
      }).then(()=>{
        alert('worker added')
      }).catch((error)=>{
        alert(error.message)
      })
  }

  const editWorkerData = () =>{
    setEditRecoveryDataDisplay('none'); 
    const newWorkersArray = workers.filter(worker => worker.name !== workerName )
    newWorkersArray.push(workerClicked)
    set(ref(db, `/users/${auth.currentUser?.uid}`,{merge:true}), {
      workers:newWorkersArray
    }).then(()=>{
      alert('worker data updated')
    }).catch((error)=>{
    })

  }

  const calculateRecoveryDays = (years,hours) =>{
    let daysForWorker;
     if(years == 1){
      daysForWorker = 5
     }else if(years == 2 || years == 3){
      daysForWorker = 6
     }else if(years >= 4 && years <= 10 ){
      daysForWorker = 7
     }else if(years >= 11 && years <= 15 ){
      daysForWorker = 8
     }else if(years >= 16 && years <=19 ){
      daysForWorker = 9
     }else if(years >= 20 ){
       daysForWorker = 10
     }
     const yearshoursAverage = hours/12
     const payment = parseInt(yearshoursAverage)*378*daysForWorker/182;
     const roundedPayment = Math.round(payment)
     setWorkerRecoverData({
       recoveryDays:daysForWorker,
       recoveryDaysPayment:roundedPayment
     })
  }

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.navigate("Login")
      })
      .catch(error => alert(error.message))
  }

  return (
    <ScrollView style={{flex:1 }}>
      <TouchableWithoutFeedback style={styles.container}>
         <LinearGradient
          colors={['#333', '#222', '#111']}
          style={styles.container}
        >
          <View style={styles.workitoImage}>
            <Image
              style={styles.tinyLogo}
              source={require('../images/profile.png')}
            />
          </View>
          <Text style={styles.userEmailText}>{auth.currentUser?.email}</Text>
          <View style={styles.cardContainer}>
            <Card>
              <Card.Title >WORKERS</Card.Title>
              <Card.Title >recovery days data</Card.Title>
              <Card.Divider />
              <View style={styles.workerDetails} >
                <Text style={styles.columnHeader}>first name</Text>
                <Text style={styles.columnHeader}>job</Text>
                <Text style={styles.columnHeader}>calculate</Text>
              </View>
              <Card.Divider />
  
              <View style={styles.workersContsiner}>
                {
                  workers?.map((worker)=>{
                    return <TouchableOpacity 
                    style={styles.workerButton}
                    key={Math.random()}
                    onPress={()=>{
                      setWorkerClicked({
                        name:worker.name,
                        job:worker.job,
                        yearsWorked:worker.yearsWorked,
                        hoursWorked:worker.hoursWorked
                      })
                      setWorkerCardDisplay('flex')
                      setWorkerName(worker.name)
                    }}
                    >
                      <View
                       style={styles.workerDetails}>
                        <Text style={styles.workerText}>{worker.name}</Text>
                        <Text style={styles.workerText}>{worker.job}</Text>
                        <Text style={styles.workerText}>press me</Text>
                      </View>
                     </TouchableOpacity>
                  })
                }

                <View style={[styles.workerDetails,{display:addDisplay}]} >
                    <TextInput 
                    style={styles.inputContainer}
                    placeholder='name'
                    placeholderTextColor='#808e9b'
                    style={styles.input}
                    autoCapitalize={false}
                    autoCompleteType='name'
                    onChangeText={text => setNewWorker({...newWorker,name:text})}
                    />
                    <TextInput 
                    style={styles.inputContainer}
                    placeholder='job'
                    placeholderTextColor='#808e9b'
                    style={styles.input}
                    autoCapitalize={false}
                    autoCompleteType='name'
                    onChangeText={text => setNewWorker({...newWorker,job:text})}
                    />
                    <TouchableOpacity
                    onPress={()=>{
                      addWorker();
                      setAddDisplay('none')
                    }} 
                    style={styles.addButton}>
                      <Text style={styles.addWorkerText}>add</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                onPress={()=>{
                  setAddDisplay('flex')
                }}
                style={styles.plusButton}>
                  <Text style={styles.plusText}>+</Text>
                </TouchableOpacity>

              </View>
            </Card>

            <View style={{display:workerCardDisplay}}>           
             <Card >
              <Card.Title >Recovery Days Calculator</Card.Title>
              <Card.Divider />
              <View style={styles.workerCardDisplay} >

                <View style={styles.workerDataLine}>
                  <Text style={styles.workerLineText}>name: {workerClicked.name} </Text>
                </View>

                <View style={styles.workerDataLine}>
                  <Text style={styles.workerLineText}>job: {workerClicked.job}</Text>
                </View>

                <View style={styles.workerDataLine}>
                  <Text style={styles.workerLineText}>years worked: {workerClicked.yearsWorked}</Text>
                </View>

                <View style={styles.workerDataLine}>
                  <Text style={styles.workerLineText}>hours worked this year: {workerClicked.hoursWorked}</Text>
                </View>
                
              </View>
              <View style={{display:editRecoveryDataDisplay}}>
               <Card>
               <Card.Title >Edit Worker</Card.Title>
                  <View style={styles.workerDataLine}>
                    <Text style={styles.workerLineText}>name:</Text>
                    <TextInput 
                    style={styles.inputWorkerCard}
                    placeholder={workerClicked.name}
                    placeholderTextColor='#fff'
                    autoCapitalize={false}
                    autoCompleteType='name'
                    onChangeText={text=> setWorkerClicked({...workerClicked,name:text})}
                    />
                  </View>
                  <View style={styles.workerDataLine}>
                    <Text style={styles.workerLineText}>job:</Text>
                    <TextInput 
                    style={styles.inputWorkerCard}
                    placeholder={workerClicked.job}
                    placeholderTextColor='#fff'
                    autoCapitalize={false}
                    autoCompleteType='job'
                    onChangeText={text=> setWorkerClicked({...workerClicked,job:text})}
                    />
                  </View>
                  <View style={styles.workerDataLine}>
                    <Text style={styles.workerLineText}>years worked:</Text>
                    <TextInput 
                    style={styles.inputWorkerCard}
                    placeholder={workerClicked.yearsWorked}
                    placeholderTextColor='#fff'
                    autoCapitalize={false}
                    autoCompleteType='1'
                    onChangeText={text=> setWorkerClicked({...workerClicked,yearsWorked:text})}
                    />
                  </View>
                  <View style={styles.workerDataLine}>
                    <Text style={styles.workerLineText}>hours worked:</Text>
                    <TextInput 
                    style={styles.inputWorkerCard}
                    placeholder={workerClicked.hoursWorked}
                    placeholderTextColor='#fff'
                    autoCapitalize={false}
                    autoCompleteType='1'
                    onChangeText={text=> setWorkerClicked({...workerClicked,hoursWorked:text})}
                    />
                  </View>
                  <View style={{alignItems:'center'}}>
                    <TouchableOpacity
                     style={styles.calculateButton}
                     onPress={editWorkerData}
                    >
                      <Text style={styles.buttonText}>edit</Text>
                    </TouchableOpacity>
                  </View>
               </Card>
              </View>

              <View style={{alignItems:'center'}}>
                 <TouchableOpacity
                  style={styles.calculateButton}
                  onPress={()=> setEditRecoveryDataDisplay('flex')}
                 >
                    <Text style={styles.buttonText}>change data</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                 style={styles.calculateButton}
                 onPress={() =>{
                   calculateRecoveryDays(workerClicked.yearsWorked, workerClicked.hoursWorked)
                  }}
                 >
                    <Text style={styles.buttonText}>calculate</Text>
                 </TouchableOpacity>
              </View>
             
              <Card.Divider />

              <Card>
                <Text style={styles.recoveryCalculatorData}>
                  recovery days :{workerRecoveryData.recoveryDays}
                </Text>
                <Text style={styles.recoveryCalculatorData}>
                  recovery payment :{workerRecoveryData.recoveryDaysPayment} 	{'\u20AA'}
                </Text>
              </Card>

            </Card>
            </View>
          </View>

          <TouchableOpacity
             onPress={handleSignOut}
             style={styles.button}
            >
            <Text style={styles.buttonText}>Sign out</Text>
           </TouchableOpacity>

           <View style={{height:700}}>
           </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </ScrollView>
  )
}

export default HomeScreen

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
  userEmailText: {
    color: '#fff',
    height: 40,
    fontSize: 25,
    fontWeight: 'bold',
    margin: 10,
    textAlign:'center'
  },
  cardContainer:{
    width:'80%',
  },
  columnHeader:{
    fontWeight:'800',
    justifyContent:'center',
    flex:1,
    textAlign:'center'
  },
  workersContsiner:{
    alignItems:'center'
  },
  workerDetails:{
    flexDirection:'row',
    width:'100%'
  },
  workerButton: {
    backgroundColor: '#0782F9',
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5
  },
  workerText:{
    padding: 10,
    justifyContent:'center',
    flex:1,
    color: '#fff'
  },
  inputContainer:{
    width:'100%',
    alignItems:'center',
    marginTop:30
  },
  input: {
    width: '30%',
    height: 35,
    backgroundColor: '#444',
    borderRadius: 6,
    marginTop: 10,
    fontSize: 15,
    color: '#fff',
    textAlign:'center',
    flex: 1,
    margin: 4
  },
  addButton:{
    backgroundColor: '#0782F9',
    borderRadius: '15%',
    width:'100%',
    height: '60%',
    alignItems:'center',
    marginTop:15,
    flex: 1
  },
  addWorkerText:{
    borderRadius: 6,
    fontSize: 15,
    color: '#fff',
    textAlign:'center',
    padding: 7
  },
  plusButton:{
    backgroundColor: '#0782F9',
    width: 45,
    borderRadius: '15%',
    alignItems: 'center',
    marginTop: 30,
  },
  plusText:{
    fontSize:35,
    color: '#fff'
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  inputWorkerCard:{
    width: '40%',
    height: 28,
    backgroundColor: '#444',
    borderRadius: 6,
    fontSize: 15,
    color: '#fff',
    textAlign:'center',
    margin: 4,
  },
  workerDataLine:{
    flexDirection:'row'
  },
  workerLineText:{
    fontSize:15
  },
  calculateButton:{
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin:10,
  },
  recoveryCalculatorData:{
    fontWeight:'bold',
    textAlign:'center',
    color: 'red'
  }
})