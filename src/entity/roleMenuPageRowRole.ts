import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import {RoleMenuPageRow} from './roleMenuPageRow';

@Entity()
export class RoleMenuPageRowRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  roleId!: string;

  @Column('varchar', {nullable: true})
  emoji?: string;

  @Column('varchar', {length: 50, nullable: true})
  description?: string;

  @ManyToOne(() => RoleMenuPageRow, row => row.roles, {onDelete: 'CASCADE'})
  row!: RoleMenuPageRow;
}
