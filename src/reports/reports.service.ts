import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Report } from './reports.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDTO } from './dtos/create-report.dto';
import { User } from '../users/users.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDTO: CreateReportDTO, user: User) {
    const report = this.repo.create(reportDTO);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const reportId = Number(id);
    const report = await this.repo.findOneBy({ id: reportId });
    
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.approved = approved;

    return this.repo.save(report);
  }
}
