import { Event } from "../../src/utils/Event";

describe("utils/Event", () => {
  it("invoke", () => {
    const event = new Event();
    const mockCallback1 = jest.fn(() => {});
    const mockCallback2 = jest.fn(() => {});

    event.AddListener(mockCallback1);
    event.AddListener(mockCallback2);

    event.Invoke(null);
    event.Invoke(null);
    event.Invoke(null);

    expect(mockCallback1.mock.calls.length).toBe(3);
    expect(mockCallback2.mock.calls.length).toBe(3);
  });

  it("generic (number)", () => {
    const event = new Event<number>();
    const mockCallback1 = jest.fn((arg: number) => {});
    const mockCallback2 = jest.fn((arg: number) => {});

    event.AddListener(mockCallback1);
    event.AddListener(mockCallback2);

    event.Invoke(9);

    expect(mockCallback1.mock.calls[0][0]).toBe(9);
    expect(mockCallback2.mock.calls[0][0]).toBe(9);
  });

  it("generic (object)", () => {
    const event = new Event<{ damage: number }>();
    const mockCallback1 = jest.fn((arg: { damage: number }) => {});
    const mockCallback2 = jest.fn((arg: { damage: number }) => {});

    event.AddListener(mockCallback1);
    event.AddListener(mockCallback2);

    event.Invoke({ damage: 8 });

    expect(mockCallback1.mock.calls[0][0].damage).toBe(8);
    expect(mockCallback2.mock.calls[0][0].damage).toBe(8);
  });

  it("removeListener", () => {
    const event = new Event();
    const mockCallback1 = jest.fn(() => {});
    const mockCallback2 = jest.fn(() => {});

    event.AddListener(mockCallback1);
    event.AddListener(mockCallback2);
    event.Invoke(null);

    event.RemoveListener(mockCallback2);
    event.Invoke(null);

    expect(mockCallback1.mock.calls.length).toBe(2);
    expect(mockCallback2.mock.calls.length).toBe(1);
  });
});
