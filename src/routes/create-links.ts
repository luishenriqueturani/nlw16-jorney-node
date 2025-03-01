import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";



export async function createLinks(app: FastifyInstance) {

  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:tripId/links',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid()
        }),
        body: z.object({
          title: z.string().min(4),
          url: z.string().url(),
        })
      }
    }, async (request, reply) => {
      const { tripId } = request.params
      const { url, title } = request.body

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId
        }
      })

      if(!trip) throw new ClientError('Trip not found')


      const link = await prisma.link.create({
        data: {
          title,
          url,
          tripId
        }
      })

      return reply.status(201).send(link)

    }
  )

}