declare namespace Express {
  export interface Request {
    user?: {
      db_id: string,
      supertoken_id: string;
      sessionHandle: string;
    };
  }
} 