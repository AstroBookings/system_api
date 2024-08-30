import { Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('clear')
  async clearDatabase() {
    return this.adminService.clearDatabase();
  }

  @Post('create')
  async createCollections() {
    return this.adminService.createCollections();
  }

  @Post('seed')
  async seedDatabase() {
    return this.adminService.seedDatabase();
  }
}
