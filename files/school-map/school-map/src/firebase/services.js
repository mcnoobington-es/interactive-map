import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where 
} from 'firebase/firestore';
import { db } from './config';

// Collection names
const COLLECTIONS = {
  ROOMS: 'rooms',
  CLASSES: 'classes',
  TEACHERS: 'teachers',
  STUDENTS: 'students'
};

// ============ ROOMS ============

// Get all rooms
export const getAllRooms = async () => {
  try {
    const roomsCollection = collection(db, COLLECTIONS.ROOMS);
    const roomsSnapshot = await getDocs(roomsCollection);
    return roomsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

// Get rooms by floor
export const getRoomsByFloor = async (floor) => {
  try {
    const roomsCollection = collection(db, COLLECTIONS.ROOMS);
    const q = query(roomsCollection, where('floor', '==', floor));
    const roomsSnapshot = await getDocs(q);
    return roomsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching rooms by floor:', error);
    throw error;
  }
};

// Get single room
export const getRoom = async (roomId) => {
  try {
    const roomDoc = doc(db, COLLECTIONS.ROOMS, roomId);
    const roomSnapshot = await getDoc(roomDoc);
    if (roomSnapshot.exists()) {
      return { id: roomSnapshot.id, ...roomSnapshot.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching room:', error);
    throw error;
  }
};

// Add new room
export const addRoom = async (roomData) => {
  try {
    const roomsCollection = collection(db, COLLECTIONS.ROOMS);
    const docRef = await addDoc(roomsCollection, roomData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding room:', error);
    throw error;
  }
};

// Update room
export const updateRoom = async (roomId, roomData) => {
  try {
    const roomDoc = doc(db, COLLECTIONS.ROOMS, roomId);
    await updateDoc(roomDoc, roomData);
  } catch (error) {
    console.error('Error updating room:', error);
    throw error;
  }
};

// Delete room
export const deleteRoom = async (roomId) => {
  try {
    const roomDoc = doc(db, COLLECTIONS.ROOMS, roomId);
    await deleteDoc(roomDoc);
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
};

// ============ CLASSES ============

// Get all classes
export const getAllClasses = async () => {
  try {
    const classesCollection = collection(db, COLLECTIONS.CLASSES);
    const classesSnapshot = await getDocs(classesCollection);
    return classesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
};

// Get classes by room and period
export const getClassesByRoomAndPeriod = async (room, period) => {
  try {
    const classesCollection = collection(db, COLLECTIONS.CLASSES);
    const q = query(
      classesCollection, 
      where('room', '==', room),
      where('block', '==', period)
    );
    const classesSnapshot = await getDocs(q);
    return classesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
};

// Get classes by teacher
export const getClassesByTeacher = async (teacher) => {
  try {
    const classesCollection = collection(db, COLLECTIONS.CLASSES);
    const q = query(classesCollection, where('teacher', '==', teacher));
    const classesSnapshot = await getDocs(q);
    return classesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching classes by teacher:', error);
    throw error;
  }
};

// Add new class
export const addClass = async (classData) => {
  try {
    const classesCollection = collection(db, COLLECTIONS.CLASSES);
    const docRef = await addDoc(classesCollection, classData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding class:', error);
    throw error;
  }
};

// Update class
export const updateClass = async (classId, classData) => {
  try {
    const classDoc = doc(db, COLLECTIONS.CLASSES, classId);
    await updateDoc(classDoc, classData);
  } catch (error) {
    console.error('Error updating class:', error);
    throw error;
  }
};

// Delete class
export const deleteClass = async (classId) => {
  try {
    const classDoc = doc(db, COLLECTIONS.CLASSES, classId);
    await deleteDoc(classDoc);
  } catch (error) {
    console.error('Error deleting class:', error);
    throw error;
  }
};

// ============ TEACHERS ============

// Get all teachers
export const getAllTeachers = async () => {
  try {
    const teachersCollection = collection(db, COLLECTIONS.TEACHERS);
    const teachersSnapshot = await getDocs(teachersCollection);
    return teachersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }
};

// Get single teacher
export const getTeacher = async (teacherId) => {
  try {
    const teacherDoc = doc(db, COLLECTIONS.TEACHERS, teacherId);
    const teacherSnapshot = await getDoc(teacherDoc);
    if (teacherSnapshot.exists()) {
      return { id: teacherSnapshot.id, ...teacherSnapshot.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching teacher:', error);
    throw error;
  }
};

// Add new teacher
export const addTeacher = async (teacherData) => {
  try {
    const teachersCollection = collection(db, COLLECTIONS.TEACHERS);
    const docRef = await addDoc(teachersCollection, teacherData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding teacher:', error);
    throw error;
  }
};

// Update teacher
export const updateTeacher = async (teacherId, teacherData) => {
  try {
    const teacherDoc = doc(db, COLLECTIONS.TEACHERS, teacherId);
    await updateDoc(teacherDoc, teacherData);
  } catch (error) {
    console.error('Error updating teacher:', error);
    throw error;
  }
};

// Delete teacher
export const deleteTeacher = async (teacherId) => {
  try {
    const teacherDoc = doc(db, COLLECTIONS.TEACHERS, teacherId);
    await deleteDoc(teacherDoc);
  } catch (error) {
    console.error('Error deleting teacher:', error);
    throw error;
  }
};

// ============ UTILITY FUNCTIONS ============

// Batch upload data (useful for initial data import)
export const batchUploadClasses = async (classesArray) => {
  try {
    const classesCollection = collection(db, COLLECTIONS.CLASSES);
    const promises = classesArray.map(classData => 
      addDoc(classesCollection, classData)
    );
    await Promise.all(promises);
    console.log(`Successfully uploaded ${classesArray.length} classes`);
  } catch (error) {
    console.error('Error batch uploading classes:', error);
    throw error;
  }
};

export const batchUploadRooms = async (roomsArray) => {
  try {
    const roomsCollection = collection(db, COLLECTIONS.ROOMS);
    const promises = roomsArray.map(roomData => 
      addDoc(roomsCollection, roomData)
    );
    await Promise.all(promises);
    console.log(`Successfully uploaded ${roomsArray.length} rooms`);
  } catch (error) {
    console.error('Error batch uploading rooms:', error);
    throw error;
  }
};
