import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BoardDialogComponent } from '../dialogs/board-dialog.component';
import { Board } from '../models/board.model';
import { BoardService } from '../services/board.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardListComponent implements OnInit, OnDestroy {
  boards: Board[];
  sub: Subscription;

  constructor(
    private readonly boardService: BoardService,
    private readonly cdr: ChangeDetectorRef,
    private readonly matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.sub = this.boardService
      .getUserBoards()
      .pipe(
        map(boards => {
          return boards.map((board, _, arr) => {
            return { ...board, connectedList: arr.filter(b => b.id !== board.id).map(b => b.id) };
          });
        })
      )
      .subscribe(boards => {
        this.boards = boards.slice();
        this.cdr.markForCheck();
        console.log(boards);
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.boards, event.previousIndex, event.currentIndex);
    this.boardService.sortBoards(this.boards);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  openBoardDialog() {
    const dialogRef = this.matDialog.open(BoardDialogComponent, {
      width: '400px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.boardService.createBoard({ title: result, priority: this.boards.length });
      }
    });
  }
}
