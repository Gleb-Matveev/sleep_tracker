import { Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class PaginationService {
  createPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    req: Request,
    res: Response,
  ): { data: T[]; meta: PaginationMeta } {
    const totalPages = Math.ceil(total / limit);

    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;
    const links: string[] = [];

    if (page > 1) {
      links.push(`<${baseUrl}?page=${page - 1}&limit=${limit}>; rel="prev"`);
    }
    if (page < totalPages) {
      links.push(`<${baseUrl}?page=${page + 1}&limit=${limit}>; rel="next"`);
    }
    links.push(`<${baseUrl}?page=1&limit=${limit}>; rel="first"`);
    if (totalPages > 0) {
      links.push(`<${baseUrl}?page=${totalPages}&limit=${limit}>; rel="last"`);
    }

    if (links.length > 0) {
      res.setHeader('Link', links.join(', '));
    }

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
}
