import type { IFramesSegmentUnion, ITextSegment, IVideoProtocol } from '@video-editor/shared'
import Ajv from 'ajv'
import ajvErrors from 'ajv-errors'
import ajvKeywords from 'ajv-keywords'
import ajvFormats from 'ajv-formats'
import { framesSegmentRule, textSegmentRule, videoProtocolBasicRule } from './rules'

export function createVerify() {
  const ajv = new Ajv({ allErrors: true, strict: 'log' })
  // install ajv-errors plugin
  ajvErrors(ajv)
  // install ajv-keywords plugin
  ajvKeywords(ajv)
  // install ajv-formats plugin
  ajvFormats(ajv)

  const validateBasic = ajv.compile(videoProtocolBasicRule)
  const validateFramesSegment = ajv.compile(framesSegmentRule)
  const validateTextSegment = ajv.compile(textSegmentRule)

  const verifyBasic = (o: object) => {
    if (validateBasic(o) === false)
      throw new Error(ajv.errorsText(validateBasic.errors))

    return o as IVideoProtocol
  }

  const verifyFramesSegment = (o: object) => {
    if (validateFramesSegment(o) === false)
      throw new Error(ajv.errorsText(validateFramesSegment.errors))

    return o as IFramesSegmentUnion
  }

  const verifyTextSegment = (o: object) => {
    if (validateTextSegment(o) === false)
      throw new Error(ajv.errorsText(validateTextSegment.errors))

    return o as ITextSegment
  }

  return { verifyBasic, verifyFramesSegment, verifyTextSegment }
}
