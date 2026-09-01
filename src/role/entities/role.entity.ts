import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../user/entity/user.entity';

@ObjectType()
@Entity('roles')
export class Role {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
