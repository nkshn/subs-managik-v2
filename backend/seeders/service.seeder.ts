type ServiceSeedData = {
  fullName: string;
  shortName: string;
  backgroundColor: string;
}

export async function seedServices(prisma) {
  const services: ServiceSeedData[] = [
    { fullName: "Amazon Prime", shortName: "AP", backgroundColor: "#00A8E1" },
    { fullName: "Apple Music", shortName: "AM", backgroundColor: "#000000" },
    { fullName: "Google Play Music", shortName: "GP", backgroundColor: "#FF5722" },
    { fullName: "Netflix", shortName: "NE", backgroundColor: "#E50914" },
    { fullName: "Spotify", shortName: "SP", backgroundColor: "#1DB954" },
    { fullName: "YouTube Music", shortName: "YT", backgroundColor: "#FF0000" },
    { fullName: "Starlink", shortName: "ST", backgroundColor: "#0033A0" },
    { fullName: "Megogo", shortName: "ME", backgroundColor: "#22C3B1" },
    { fullName: "GitHub Copilot", shortName: "GC", backgroundColor: "#6CC644" },
    { fullName: "ChatGPT", shortName: "CH", backgroundColor: "#00A67E" },
    { fullName: "GeForce Now", shortName: "GF", backgroundColor: "#76B900" },
  ]

  await prisma.service.deleteMany();

  await Promise.all(services
    .map(service => {
      // eslint-disable-next-line no-console
      console.log(`Seeding service: ${service.fullName}...`)

      return prisma.service.create({
        data: service
      })
    })
  )
}