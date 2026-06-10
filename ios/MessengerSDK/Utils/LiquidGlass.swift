import SwiftUI

extension View {
    @ViewBuilder
    func liquidGlass(
        tint: Color = .clear,
        shape: some Shape = RoundedRectangle(cornerRadius: 20, style: .continuous),
        shadowRadius: CGFloat = 0
    ) -> some View {
        self
            .background(shape.fill(.ultraThinMaterial))
            .shadow(radius: shadowRadius)
    }

    @ViewBuilder
    func liquidGlassCard(
        tint: Color = .clear,
        cornerRadius: CGFloat = 20
    ) -> some View {
        let s = RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
        self.background(s.fill(.regularMaterial))
            .clipShape(s)
    }
}

struct GlassContainer<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        content
    }
}
