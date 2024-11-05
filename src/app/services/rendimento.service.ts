import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Rendimento } from './../models/rendimento';

@Injectable({
  providedIn: 'root',
})
export class RendimentoService {
  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {}

  private async getUserId(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    return user ? user.uid : null;
  }
  addRendimento(rendimento: Rendimento): Observable<void> {
    return from(this.getUserId()).pipe(
      switchMap((userId) => {
        if (!userId) {
          throw new Error('Usuário não autenticado');
        }
        const id = this.afs.createId();
        const rendimentoComId: Rendimento = {
          id: id,
          rendimento: rendimento.rendimento,
          valor: rendimento.valor,
          data: rendimento.data,
          userId: userId,
        };
        return from(
          this.afs.collection('/rendimentos').doc(id).set(rendimentoComId)
        );
      })
    );
  }
  getAllRendimentos(): Observable<Rendimento[]> {
    return from(this.getUserId()).pipe(
      switchMap((userId) => {
        if (!userId) {
          throw new Error('Usuário não autenticado');
        }
        return this.afs
          .collection<Rendimento>('/rendimentos', (ref) =>
            ref.where('userId', '==', userId)
          ) // Filtrar rendimentos pelo userId
          .snapshotChanges()
          .pipe(
            map((actions) =>
              actions.map((a) => {
                const data = a.payload.doc.data() as Rendimento;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      })
    );
  }

  calcularValorTotal(): Observable<number> {
    return this.getAllRendimentos().pipe(
      map((rendimentos) => {
        return rendimentos.reduce(
          (total, rendimento) => total + rendimento.valor,
          0
        );
      })
    );
  }
  deleteRendimento(rendimentoId: string): Observable<void> {
    return from(this.afs.collection('/rendimentos').doc(rendimentoId).delete());
  }
  updateRendimento(rendimento: Rendimento): Observable<void> {
    return from(
      this.afs.collection('/rendimentos').doc(rendimento.id).update(rendimento)
    );
  }
}
