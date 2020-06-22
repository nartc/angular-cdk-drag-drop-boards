import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';
import { BoardListComponent } from './board-list/board-list.component';
import { BoardComponent } from './board/board.component';
import { BoardDialogComponent } from './dialogs/board-dialog.component';
import { TaskDialogComponent } from './dialogs/task-dialog.component';

import { KanbanRoutingModule } from './kanban-routing.module';

@NgModule({
  declarations: [BoardListComponent, BoardComponent, BoardDialogComponent, TaskDialogComponent],
  imports: [SharedModule, KanbanRoutingModule, FormsModule, DragDropModule, MatDialogModule, MatButtonToggleModule],
  entryComponents: [BoardDialogComponent, TaskDialogComponent],
})
export class KanbanModule {}
