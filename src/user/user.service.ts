import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { v1 as uuid } from 'uuid';

@Injectable()
export class UserService {
  private sessionArr: { [key: string]: string }[] = [];

  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {}

  printSession(): void {
    console.log('-------------');
    let i = 0;
    for (; i < this.sessionArr.length; i++) {
      console.log('[GAME] printSession', this.sessionArr[i]);
    }
    console.log('-------------');
  }

  deleteSession(intraID: string): void {
    console.log('[GAME]deleteSession');
    const index = this.sessionArr.findIndex(
      (session) => session.name === intraID,
    );
    if (index !== -1) {
      this.sessionArr.splice(index, 1);
    }
  }

  //세션 키 발급
  createSession(intraID: string): { [key: string]: string } {
    const newSession = { key: uuid(), name: intraID };
    this.sessionArr.push(newSession);
    return newSession;
  }

  //세션 키로 인트라 아이디 찾기
  getIntraID(sessionKey: string): string | undefined {
    // console.log('!!!!!!!!!!!!', sessionKey);
    const result = this.sessionArr.find((item) => item.key == sessionKey);
    console.log('세션키로 아이디 찾기 :', result);
    if (result == undefined) {
      console.log(' --- undefined');
      return undefined;
    }
    return result.name;
  }

  //인트라 아이디로 세션 찾기
  getSession(intraID: string): string | undefined {
    const result = this.sessionArr.find((item) => item.name == intraID);
    return result ? result.key : undefined;
  }

  //모든 유저 찾기
  async findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  //유저 찾기
  async findUser(intraID: string): Promise<User> {
    return this.userRepository.findOne({ where: { intraid: intraID } });
  }

  //PK 값으로 유저 찾기
  async findUserByID(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  //닉네임으로 유저 찾기
  async findNickname(findNickname: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { nickname: findNickname },
    });
  }

  //유저 생성
  async createUser(
    intraID: string,
    email: string,
  ): Promise<User> {
    const user = this.userRepository.create();
    user.intraid = intraID;
    user.nickname = null;
    user.email = email;
    const temp = await this.userRepository.save(user);
    user.nickname = `anon_${temp.id}`;
    return this.userRepository.save(user);
  }

  //유저 삭제
  async deleteUser(intraID: string): Promise<boolean> {
    const userData = await this.findUser(intraID);
    if (userData == null || intraID == undefined) return false;
    const delResult = await this.userRepository.delete(userData.id);
    if (delResult.affected == 0) return false;
    return true;
  }

  //게임 결과 업데이트
  async updateResult(intraID: string, result): Promise<boolean> {
    const userData = await this.findUser(intraID);
    if (userData == null || intraID == undefined) {
      return false;
    }
    if (result.result.win) {
      await this.userRepository.increment({ id: userData.id }, 'wincount', 1);
      await this.userRepository.increment({ id: userData.id }, 'rating', 1);
    }
    if (result.result.lose) {
      await this.userRepository.increment({ id: userData.id }, 'losecount', 1);
      await this.userRepository.increment({ id: userData.id }, 'rating', -1);
    }
    return true;
  }

  //email 설정 업데이트
  async updateEmail(intraID: string, email: string): Promise<boolean> {
    const userData = await this.findUser(intraID);
    if (userData == null || intraID == undefined) return false;
    userData.email = email;
    await this.userRepository.save(userData);
    return true;
  }

  //Otp 설정 업데이트
  // async updateOtp(intraID: string, otp: boolean): Promise<boolean> {
  //   const userData = await this.findUser(intraID);
  //   if (userData == null || intraID == undefined) return false;
  //   userData.isotp = otp;
  //   await this.userRepository.save(userData);
  //   return true;
  // }

  //닉네임 설정 업데이트
  async updateNickname(intraID: string, nickname: string): Promise<boolean> {
    const findData = await this.findNickname(nickname);
    if (findData != null || intraID == undefined) return false;
    const userData = await this.findUser(intraID);
    userData.nickname = nickname;
    await this.userRepository.save(userData);
    return true;
  }

  //Avatar URL 업데이트
  // async updateURL(intraID: string, url: string): Promise<boolean> {
  //   const userData = await this.findUser(intraID);
  //   if (userData == null || intraID == undefined) return false;
  //   userData.avatar = url;
  //   await this.userRepository.save(userData);
  //   return true;
  // }
}
