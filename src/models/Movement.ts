export class Movement {
  container_id: number;
  type:
    | "boarding"
    | "unloading"
    | "gate in"
    | "gate out"
    | "repositioning"
    | "weighing"
    | "scanner";
  start_hour: Date;
  end_hour: Date;
}
