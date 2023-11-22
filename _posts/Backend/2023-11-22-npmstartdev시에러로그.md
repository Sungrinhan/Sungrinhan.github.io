---
title: "[Err] Nest can't resolve dependencies of the BowlingballService (start:dev)"
date: 2023-11-22 22:12:SS +/- TTTT
categories: [Backend]
tags: [backend, nest, npmstart] # TAG는 반드시 소문자로 이루어져야함!
---

@Injectable()
export default class BowlingballService {
constructor(
@InjectRepository(BowlingballEntity)
private readonly bowlingballRepository: Repository<BowlingballEntity>,
) {}

async postBowlingball(body: CreateBowlingballDto) {
try {
const result = await this.bowlingballRepository.save(body);

      // 볼링볼 이름이 중복되는지 확인하는 로직 필요
      if (!result) {
        throw new Error('Bowlingball not found');
      }

      return result;
    } catch (error) {
      // 에러 처리 로직
      throw error;
    }

}

async getBowlingball(id: number): Promise<BowlingballEntity> {
try {
const result = await this.bowlingballRepository.findOne({
where: { id },
});

      // 볼링볼 id 가 없을 경우
      if (!result) {
        throw new Error('Bowlingball not found');
      }

      return result;
    } catch (error) {
      throw error;
    }

}

/\*\*

- 볼링볼 post 내용을 가져오는 API
- 볼링공 info, 볼링공 star, like, comment return
- @param id
- @returns
  \*/
  async getBowlingballPost(id: number) {
  try {
  const bowlingballInfo = await this.bowlingballRepository.findOne({
  where: { id },
  });

      if (!bowlingballInfo) {
        throw new Error('Bowlingball not found');
      }

      // star 가져오기
      // const star = await.this.starRepository.find({
      //   where
      // })

      // like 가져오기

      // comment 가져오기

  } catch (error) {
  throw error;
  }
  }

async getBowlingballList(): Promise<BowlingballEntity[]> {
try {
const result = await this.bowlingballRepository.find();

      if (!result) {
        throw new Error('Bowlingball not found');
      }

      return result;
    } catch (error) {
      throw error;
    }

}
}

[Nest] 67286 - 11/22/2023, 10:08:52 PM ERROR [ExceptionHandler] Nest can't resolve dependencies of the BowlingballService (?). Please make sure that the argument BowlingballEntityRepository at index [0] is available in the AppModule context.

Potential solutions:

- Is AppModule a valid NestJS module?
- If BowlingballEntityRepository is a provider, is it part of the current AppModule?
- If BowlingballEntityRepository is exported from a separate @Module, is that module imported within AppModule?
  @Module({
  imports: [ /* the Module containing BowlingballEntityRepository */ ]
  })
