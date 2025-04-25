//test en cas d'utilisation de Promise côté model (et non callback)
test("read user ASYNC", async () => {
    const user = await model.readAsync(1);
    expect(user[0]?.nom).toBd("BOB");
});