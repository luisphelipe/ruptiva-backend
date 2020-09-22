import app from '../app'

import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'

import models from '../../models'

chai.use(chaiHttp)

describe('GET /', () => {
  it('Should return message containing environment', async () => {
    const res = await chai.request(app).get('/')

    expect(res.body).to.eql({
      message: `Using environment ${process.env.NODE_ENV}`
    })
  })
})
