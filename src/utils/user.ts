import { doc, getDoc } from 'firebase/firestore';
import { auth, database } from '../services/firebase';
import { User } from '../types';

export const loadCurrentUser = async () => {
  const { currentUser } = auth;
  const userRef = doc(database, 'users', currentUser?.uid ?? '');
  const userSelected = await getDoc(userRef);
  if (!userSelected) {
    return null;
  }
  const user:User = {
    uid: userSelected.id,
    email: userSelected.get('email'),
    first_name: userSelected.get('first_name'),
    last_name: userSelected.get('last_name'),
    deleted: Boolean(userSelected.get('deleted')),
    admin: Boolean(userSelected.get('admin'))
  }

  return user;
}
