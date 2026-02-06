import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/quick-access";

// GET - Récupérer les notifications
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user!.id,
        ...(unreadOnly && { isRead: false }),
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId: user!.id,
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (error) {
    console.error("Erreur récupération notifications:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// PUT - Marquer les notifications comme lues
export async function PUT(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    
    if (error) return error;

    const { notificationIds } = await request.json();

    if (notificationIds && Array.isArray(notificationIds)) {
      // Marquer des notifications spécifiques
      await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId: user!.id,
        },
        data: { isRead: true },
      });
    } else {
      // Marquer toutes comme lues
      await prisma.notification.updateMany({
        where: {
          userId: user!.id,
          isRead: false,
        },
        data: { isRead: true },
      });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Erreur mise à jour notifications:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
