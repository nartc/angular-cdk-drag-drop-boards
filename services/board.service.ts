import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Board } from '../models/board.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private readonly afAuth: AngularFireAuth, private readonly afStore: AngularFirestore) {}

  private readonly boardCollection: AngularFirestoreCollection<Board> = this.afStore.collection<Board>('boards');

  async createBoard(board: Board) {
    const user = await this.afAuth.auth.currentUser;
    return this.boardCollection.add({ ...board, uid: user.uid, tasks: [{ description: 'Hello', label: 'yellow' }] });
  }

  async deleteBoard(boardId: string) {
    return this.boardCollection.doc(boardId).delete();
  }

  async updateTasks(boardId: string, tasks: Task[]) {
    return this.boardCollection.doc(boardId).update({ tasks });
  }

  async removeTask(boardId: string, task: Task) {
    return this.boardCollection.doc(boardId).update({ tasks: firebase.firestore.FieldValue.arrayRemove(task) });
  }

  getUserBoards() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          // this.boardCollection.

          return this.afStore
            .collection<Board>('boards', ref => ref.where('uid', '==', user.uid).orderBy('priority'))
            .valueChanges({ idField: 'id' });
        }

        return of([]);
      })
    );
  }

  sortBoards(boards: Board[]) {
    const db = firebase.firestore();
    const batch = db.batch();
    const docs = boards.map(b => this.boardCollection.doc<Board>(b.id));
    docs.forEach((doc, idx) => batch.update(doc.ref, { priority: idx }));
    batch.commit();
  }
}
