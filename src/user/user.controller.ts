import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CookieService } from '../cookie/cookie.service';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cookieService: CookieService,
  ) {}

  // {
  //   "id": 20,
  //   "intraid": "alee",
  //   "avatar": "https://i.imgflip.com/1rpfag.jpg",
  //   "nickname":"ft_alee"
  //   "rating": 1205,
  //   "wincount": 10,
  //   "losecount": 5,
  //   "email": "alee@gmail.com",
  //   "isotp": true
  // }
  @Get()
  async getMyUser(@Req() req: Request) {
    const cookie = this.cookieService.extractCookie(req.cookies['session_key']);
    if (cookie == undefined) throw new NotFoundException('cookie not found');
    const target = this.userService.getIntraID(cookie);
    if (target == null) throw new NotFoundException(`There's no cookie data`);
    const userData = await this.userService.findUser(target);
    if (userData == null) throw new NotFoundException(`client not found.`);
    return userData;
  }

  @Get(':id')
  async getUser(@Param('id') intraID: string, @Req() req: Request) {
    const cookie = this.cookieService.extractCookie(req.cookies['session_key']);
    if (cookie == undefined) throw new NotFoundException('cookie not found');
    const userData = await this.userService.findUser(intraID);
    if (userData == null) throw new NotFoundException(`client not found.`);
    return userData;
  }

  //
  // {
  //   "result": {
  //     "win": false,
  //     "lose": true
  //   }
  // }
  @Post('/result')
  async updateResult(@Body('result') result, @Req() req: Request) {
    const cookie = this.cookieService.extractCookie(req.cookies['session_key']);
    if (cookie == undefined) throw new NotFoundException('cookie not found');
    const target = this.userService.getIntraID(cookie);
    const updateResult = await this.userService.updateResult(target, result);
    if (updateResult == false)
      throw new NotFoundException(`${target} not found.`);
    return;
  }

  // {
  //   "email": "alee@gmail.com"
  // }
  @Post('/email') //이메일 변경 요청
  async updateEmail(@Body('email') email: string, @Req() req: Request) {
    const cookie = this.cookieService.extractCookie(req.cookies['session_key']);
    if (cookie == undefined) throw new NotFoundException('cookie not found');
    const target = this.userService.getIntraID(cookie);
    const updateEmail = await this.userService.updateEmail(target, email);
    if (updateEmail == false)
      throw new NotFoundException(`${target} not found.`);
    return;
  }

  @Post('/join') //닉네임 설정 요청
  async updateNickname(
    @Body('nickname') nickname: string,
    @Req() req: Request,
  ) {
    const cookie = this.cookieService.extractCookie(req.cookies['session_key']);
    if (cookie == undefined) throw new NotFoundException('cookie not found');
    const target = this.userService.getIntraID(cookie);
    const updateNickname = await this.userService.updateNickname(
      target,
      nickname,
    );
    if (updateNickname == false)
      throw new InternalServerErrorException('already exist nickname');
    return;
  }

  // {
  //   "otp": true
  // }
  // @Post('/otp') //otp 설정 요청
  // async updateOtp(@Body('otp') otp: boolean, @Req() req: Request) {
  //   const cookie = this.cookieService.extractCookie(req.cookies['session_key']);
  //   if (cookie == undefined) throw new NotFoundException('cookie not found');
  //   const target = this.userService.getIntraID(cookie);
  //   const updateOtp = await this.userService.updateOtp(target, otp);
  //   if (updateOtp == false) throw new NotFoundException(`${target} not found.`);
  //   return;
  // }

  // {
  //   "url": "https://i.imgflip.com/1rpfag.jpg"
  // }
  // @Post('/avatar')
  // async updateAvatarURL(@Body('url') url: string, @Req() req: Request) {
  //   const cookie = this.cookieService.extractCookie(req.cookies['session_key']);
  //   if (cookie == undefined) throw new NotFoundException('cookie not found');
  //   const target = this.userService.getIntraID(cookie);
  //   const updateURL = await this.userService.updateURL(target, url);
  //   if (updateURL == false) throw new NotFoundException(`${target} not found.`);
  //   return;
  // }

  // {
  //   "intraID": "hena",
  // }
  @Delete('/:id')
  async deleteUser(@Param('id') intraID: string, @Req() req: Request) {
    const cookie = this.cookieService.extractCookie(req.cookies['session_key']);
    if (cookie == undefined) throw new NotFoundException('cookie not found');
    const target = this.userService.getIntraID(cookie);
    if (intraID != target) throw new ForbiddenException('forbbiden request.');
    const delResult = await this.userService.deleteUser(intraID);
    if (delResult == false)
      throw new NotFoundException(`${intraID} not found.`);
    return;
  }

  // test code 🚀
  @Post()
  async createUser(@Body() body, @Req() req: Request) {
    const { intraId, email } = body;

    if(!intraId || !email)
      return 'error!';

    const user = await this.userService.createUser(intraId, email);
    return user;
  }
}

/*
{
    "name":"이솝",
    "price":"5000",
    "image": "https://perfumegraphy.com/web/product/big/202211/2d5050ab8fa1b5ab5c9de9206a47d698.jpg",
    "description": "심건우씨한테 정말 잘어울리는 향수 😎"
}
*/
