declare namespace Express {
  export interface Request {
    user?: {
      db_id: number,
      supertoken_id: string;
      sessionHandle: string;
    };
  }
} 