"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Mail, MessageCircle, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationSettings {
  emailNewMessage: boolean;
  emailNewLike: boolean;
  emailNewMatch: boolean;
  pushMessages: boolean;
  pushLikes: boolean;
  pushViews: boolean;
}

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNewMessage: true,
    emailNewLike: true,
    emailNewMatch: true,
    pushMessages: true,
    pushLikes: true,
    pushViews: false,
  });

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulation de sauvegarde (en production, appel API)
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    router.back();
  };

  const ToggleSwitch = ({
    enabled,
    onChange,
  }: {
    enabled: boolean;
    onChange: () => void;
  }) => (
    <button
      onClick={onChange}
      className={`w-12 h-7 rounded-full p-1 transition-colors ${
        enabled ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full bg-white transition-transform ${
          enabled ? "translate-x-5" : ""
        }`}
      />
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
          Notifications
        </h1>
      </div>

      {/* Notifications par email */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <Mail className="w-5 h-5 text-gray-500" />
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Notifications par email
          </h2>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Nouveaux messages
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Recevoir un email quand quelqu'un vous écrit
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.emailNewMessage}
              onChange={() => handleToggle("emailNewMessage")}
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-pink-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Nouveaux likes
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Recevoir un email quand quelqu'un vous like
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.emailNewLike}
              onChange={() => handleToggle("emailNewLike")}
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-accent-500 fill-current" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Matchs mutuels
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Recevoir un email lors d'un match
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.emailNewMatch}
              onChange={() => handleToggle("emailNewMatch")}
            />
          </div>
        </div>
      </div>

      {/* Notifications push */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <Bell className="w-5 h-5 text-gray-500" />
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Notifications sur le site
          </h2>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Messages
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Afficher les notifications de messages
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.pushMessages}
              onChange={() => handleToggle("pushMessages")}
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-pink-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Likes
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Afficher les notifications de likes
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.pushLikes}
              onChange={() => handleToggle("pushLikes")}
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Vues de profil
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Afficher qui a vu ton profil
                </p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.pushViews}
              onChange={() => handleToggle("pushViews")}
            />
          </div>
        </div>
      </div>

      <Button
        variant="accent"
        className="w-full"
        onClick={handleSave}
        isLoading={isLoading}
      >
        Enregistrer les préférences
      </Button>
    </div>
  );
}
