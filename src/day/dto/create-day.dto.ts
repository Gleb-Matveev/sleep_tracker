export class CreateDayDto {
  date: string;
  getup_score: number;
  feeling_score: number;
  wakeUpTime: string;
  wakeDownTime: string;
  description?: string;
  routineIds: number[];
}
